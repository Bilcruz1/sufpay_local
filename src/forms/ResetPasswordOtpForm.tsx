import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { completeVerification, resetPasswordOtp } from "../Apis/onBoardingApi";
import { StatusCode } from "../utils/enums";
import { IResponse } from "../utils/interfaces";
import useTokenValidation from "../utils/hooks/useTokenValidation";

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


  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    if (/^\d$/.test(value)) {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
      // Move to the next input if current input has a valid single digit
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      // Clear the input if invalid value is entered
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
      } else {
        const newValues = [...values];
        newValues[index] = "";
        setValues(newValues);
        target.value = ""; // Clear the current input
      }
    } else if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleSubmit = async () => {
    setBtnDisabled(true);
    if (values.join("").length < 5) {
      alert("Input a valid OTP");
      setBtnDisabled(false);
      return;
    }

    try {
      const response: IResponse = await resetPasswordOtp({
        otp: `${values.join("")}`,
        token: `${token}`,
      });

      console.log(response);

      if (response.data.succeeded && response.data.statusCode === StatusCode.badRequest) {
        navigate("/")
      setValues((prev) => Array(5).fill(""));

         return
      } else if (response.data.succeeded && response.data.statusCode === StatusCode.deleted) {
        navigate("/login")
      setValues((prev) => Array(5).fill(""));

         return;

      } else if (response.data.succeeded && response.data.statusCode === StatusCode.created) { 
        navigate(`/resent-opt/${token}`)
      setValues((prev) => Array(5).fill(""));

         return;

      } else if (response.data.statusCode === StatusCode.ok) {
        navigate(`/change-password/${token}`)
      setValues((prev) => Array(5).fill(""));

         return;

      } else if (response.data.statusCode === StatusCode.internalServerError) {
        alert("Server error")
      setValues((prev) => Array(5).fill(""));

        return
      }

      navigate("/login")
      setValues((prev) => Array(5).fill(""));

      return

    } catch (err) {
      setValues((prev) => Array(5).fill(""));
      alert(err);
      setBtnDisabled(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alginItems: "center",
          gap: 1,
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputsRef.current[index] = el)}
            id={`outlined-basic-${index}`}
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
        variant={"caption"}
        display={"block"}
        sx={{ textAlign: "center" }}
      >
        I didn’t receive a code{" "}
        <Link onClick={() => handleResendOtp(`${token}`)}>Resend</Link>
      </Typography>
    </Box>
  );
};

export default ResetPasswordOtpForm;
