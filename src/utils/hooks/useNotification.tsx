import React from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addNotification } from "../../redux/slices/notificationSlice";

const useNotification = () => {
  const dispatch = useDispatch();

  const showSuccessNotification = (
    message: string = "Operation successful!"
  ) => {
    dispatch(
      addNotification({
        id: uuidv4(),
        message: message,
        severity: "success",
      })
    );
  };

  const showErrorNotification = (
    message: string = "An error occurred, please try again."
  ) => {
    dispatch(
      addNotification({
        id: uuidv4(),
        message: message,
        severity: "error",
      })
    );
  };

  const showInfoNotification = (message: string) => {
    dispatch(
      addNotification({
        id: uuidv4(),
        message: message,
        severity: "info",
      })
    );
  };

  const showWarningNotification = (message: string) => {
    dispatch(
      addNotification({
        id: uuidv4(),
        message: message,
        severity: "warning",
      })
    );
  };

  return {
    showSuccessNotification,
    showErrorNotification,
    showInfoNotification,
    showWarningNotification,
  };
};

export default useNotification;
