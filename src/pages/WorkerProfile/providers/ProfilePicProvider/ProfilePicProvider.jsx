import { createContext, useContext, useState, useEffect } from "react";
import { useWorkerProfile } from "../WorkerProfileProvider/WorkerProfileProvider";
import { extractResponse } from "../../../../utils";

const ProfilePicContext = createContext(null);

export const ProfilePicProvider = ({ children }) => {
  const { isSuccess, data, editProfilePic, setEditProfilePic } =
    useWorkerProfile();
  const [operationPerformed, setOperationPerformed] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedURL, setUploadedURL] = useState(null);

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      console.log(reader.result);
      setPreviewImage(reader.result);
    };
    setSelectedFile(file);
    setOperationPerformed(true);
  };

  const onRemovePictureClicked = () => {
    setPreviewImage(null);
    setOperationPerformed(true);
  };

  const onEditProfilePicClicked = () => setEditProfilePic(true);

  const onCancelClicked = () => {
    setEditProfilePic(false);
    setOperationPerformed(false);
  };

  const onCancelOperationClicked = () => {
    setEditProfilePic(true);
    setOperationPerformed(false);
  };

  const onOperationPerformed = () => setOperationPerformed(true);

  useEffect(() => {
    if (editProfilePic || isSuccess) {
      const res = extractResponse(data);
      if (res?.data) {
        return setPreviewImage(res?.data?.pp);
      }
      setPreviewImage(null);
    }
  }, [isSuccess, editProfilePic]);

  return (
    <ProfilePicContext.Provider
      value={{
        previewImage,
        editProfilePic,
        operationPerformed,
        onSelectFile,
        onRemovePictureClicked,
        onEditProfilePicClicked,
        onCancelClicked,
        onCancelOperationClicked,
        onOperationPerformed,
      }}
    >
      {children}
    </ProfilePicContext.Provider>
  );
};

export const useProfilePic = () => useContext(ProfilePicContext);
