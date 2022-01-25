import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { useGetWorkerProfile } from "../../hooks/useGetWorkerProfile";
import { useParams } from "react-router-dom";
import { extractResponse } from "../../../../utils";
import { editWorkerReducer } from "./editWorkerReducer";
import { fieldNameToActionType } from "./utils/fieldNameToActionType";
import { validateWorkerProfile } from "./utils/validateWorkerProfile";
import { toast } from "react-toastify";
import { toastConfig } from "../../../../utils/toastConfig";

const WorkerProfileContext = createContext(null);

export const WorkerProfileProvider = ({ children }) => {
  const { workerId, bookingId } = useParams();
  const { isLoading, isSuccess, data, error } = useGetWorkerProfile(
    workerId,
    bookingId
  );

  const [editWorkerState, dispatchEditWorkerState] = useReducer(
    editWorkerReducer,
    null
  );

  const [workerProfileError, setWorkerProfileError] = useState(null);

  const onNameChange = (e) =>
    dispatchEditWorkerState({ type: "SET_NAME", payload: e.target.value });

  const [editMode, setEditMode] = useState(false);
  const [editVaccinationCert, setEditVaccinationCert] = useState(false);
  const [editProfilePic, setEditProfilePic] = useState(false);

  const onEditIconClicked = () => setEditMode(true);
  const onCancelClicked = () => setEditMode(false);

  const [activeTab, setActiveTab] = useState("1");
  const onTabClicked = (tabId) => {
    if (editMode || editVaccinationCert) {
      return toast.warning(
        "Please Save or Cancel before moving to next tab",
        toastConfig
      );
    }
    setActiveTab(tabId);
  };

  const onSaveClicked = () => {
    setWorkerProfileError(null);
    const isValid = validateWorkerProfile(
      editWorkerState,
      setWorkerProfileError
    );
    if (!isValid) {
      return;
    }
    console.log("Fields valid");
  };

  useEffect(() => {
    if (isSuccess || editMode) {
      const res = extractResponse(data);
      dispatchEditWorkerState({
        type: "SET_WORKER_PROFILE",
        payload: res?.data,
      });
    }
  }, [isSuccess, editMode]);

  return (
    <WorkerProfileContext.Provider
      value={{
        activeTab,
        editMode,
        isLoading,
        data,
        error,
        editWorkerState,
        workerProfileError,
        editVaccinationCert,
        editProfilePic,
        fieldNameToActionType,
        onTabClicked,
        onEditIconClicked,
        onCancelClicked,
        onSaveClicked,
        onNameChange,
        dispatchEditWorkerState,
        setEditVaccinationCert,
        setEditProfilePic,
      }}
    >
      {children}
    </WorkerProfileContext.Provider>
  );
};

export const useWorkerProfile = () => useContext(WorkerProfileContext);
