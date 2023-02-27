export { ChannelInfoIcon } from './ChannelInfoIcon';
export { ChannelSaveIcon } from './ChannelSaveIcon';
export { CloseThreadIcon } from './CloseThreadIcon';
export { CommandIcon } from './CommandIcon';
export { CreateChannelIcon } from './CreateChannelIcon';
export { EmojiIcon } from './EmojiIcon';
export { HamburgerIcon } from './HamburgerIcon';
export { LightningBoltSmall } from './LightningBoltSmall';
export { SendIcon } from './SendIcon';
export { XButton } from './XButton';
export { XButtonBackground } from './XButtonBackground';

export const getCleanImage = (member) => {
  let cleanImage = member?.user?.image || 'https://storage.googleapis.com/ph-assets/ic_hr_manager.png';
  return cleanImage;
};
