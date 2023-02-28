import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { StreamChat } from 'stream-chat';
import {
    Chat,
    Channel,
    ChannelList,
  } from 'stream-chat-react';

  import {
    CreateChannel,
    CustomMessage,
    MessagingChannelList,
    MessagingChannelPreview,
    MessagingInput,
  } from './components';

  import { ChannelInner } from './components/ChannelInner/ChannelInner';

import 'stream-chat-react/dist/css/v2/index.css';
import '../../layout.css';

const chatClient = new StreamChat(envs.CHAT_API_KEY);
const userToken = envs.CHAT_USER_TOKEN;

chatClient.connectUser(
  {
    id: 'hr_manager_chat_user',
    name: 'Alisha (HR manager)',
    image: 'https://storage.googleapis.com/ph-assets/ic_hr_manager.png',
  },
  userToken,
);

const filters = { type: 'messaging', members: { $in: ['hr_manager_chat_user'] } };
const sort = { last_message_at: -1 };
const options = { state: true, watch: true, presence: true, limit: 8 };
export const GiphyContext = React.createContext({});

export const Chats = () => {
  const [giphyState, setGiphyState] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  const giphyContextValue = { giphyState, setGiphyState };

  if (!chatClient) return null;

  return (
    <DashboardLayout>
    <Chat client={chatClient} theme={`messaging ${theme}`}>
      <div class="flex-container">
      <div class="flex-child-channel-list">
        <ChannelList
          filters={filters}
          sort={sort}
          options={options}
          List={(props) => (
            <MessagingChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />
          )}
          Preview={(props) => <MessagingChannelPreview {...props} {...{ setIsCreating }} />}
        />
      </div>
      <div class="flex-child-channel">
        <Channel
          Input={MessagingInput}
          maxNumberOfFiles={10}
          Message={CustomMessage}
          multipleUploads={true}
          TypingIndicator={() => null}
        >
          {isCreating && (
            <CreateChannel toggleMobile={()=>{}} onClose={() => setIsCreating(false)} />
          )}
          <GiphyContext.Provider value={giphyContextValue}>
            <ChannelInner theme={theme} toggleMobile={()=>{}} />
          </GiphyContext.Provider>
        </Channel>
      </div>
      </div>
    </Chat>
    </DashboardLayout>
  );
};