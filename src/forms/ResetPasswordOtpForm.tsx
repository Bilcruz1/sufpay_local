import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordOtp } from "../Apis/onBoardingApi";
import { StatusCode } from "../utils/enums";
import { IResponse } from "../utils/interfaces";
import useTokenValidation from "../utils/hooks/useTokenValidation";
import useNotification from "../utils/hooks/useNotification";

interface IProps {
  btnDisabled: boolean;
  setBtnDisabled: (disabled: boolean) => void;
}

const ResetPasswordOtpForm: React.FC<IProps> = ({
  btnDisabled,
  setBtnDisabled,
}) => {
  const [values, setValues] = useState<string[]>(Array(5).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { token } = useParams();
  const { handleResendOtp } = useTokenValidation();
  const {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
  } = useNotification();

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    if (/^\d$/.test(value)) {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      event.target.value = "";
    }
  };


  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    const target = event.currentTarget as HTMLInputElement;
    if (event.key === "Backspace") {
      if (!target.value && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      const newValues = [...values];
      newValues[index] = "";
      setValues(newValues);
      target.value = "";
    } else if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleSubmit = async () => {
    setBtnDisabled(true);
    if (values.join("").length < 5) {
      showWarningNotification("Input a valid OTP");
      setBtnDisabled(false);
      return;
    }

    try {
      const response: IResponse = await resetPasswordOtp({
        otp: `${values.join("")}`,
        token: `${token}`,
      });

      if (
        response.data.succeeded &&
        response.data.statusCode === StatusCode.ok
      ) {
        navigate(`/change-password/${token}`);
        setValues(Array(5).fill(""));
        return;
      }

      if (response.data.statusCode === StatusCode.internalServerError) {
        showErrorNotification();
      }

      setValues(Array(5).fill(""));
      setBtnDisabled(false);
    } catch (err) {
      setValues(Array(5).fill(""));
      showErrorNotification();
      setBtnDisabled(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputsRef.current[index] = el)}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: { textAlign: "center", width: "2ch" },
            }}
            value={values[index]}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        ))}
      </Box>

      <Button
        sx={{
          marginTop: "4rem",
          width: "100%",
          background: "#AAC645",
          borderRadius: "32px",
        }}
        variant="contained"
        disabled={btnDisabled}
        onClick={handleSubmit}
      >
        Verify
      </Button>
      <Typography
        mt={4}
        variant="caption"
        display="block"
        sx={{ textAlign: "center" }}
      >
        I didn’t receive a code{" "}
        <Link onClick={() => handleResendOtp(`${token}`)}>Resend</Link>
      </Typography>
    </Box>
  );
};

export default ResetPasswordOtpForm;
