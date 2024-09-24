import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { completeVerification, resendOtp } from "../Apis/onBoardingApi";
import { useNavigate } from "react-router-dom";
import { IResponse } from "../utils/interfaces";
import { StatusCode } from "../utils/enums";
import { decryptData } from "../utils/aesEncryption";

const VerifyAccountForm: React.FC = () => {
  const [values, setValues] = useState<string[]>(Array(5).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [btnIsDiabaled, setBtnIsDiabaled] = useState<boolean>(false);
  const { token } = useParams();
  const navigate = useNavigate();

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
    setBtnIsDiabaled(true);
    if (values.length < 5) alert("incomplete");

    try {
      const response: IResponse = await completeVerification({
        otp: `${values.join("")}`,
        otpToken: `${token}`,
      });

      console.log(response);

      if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.notFound &&
        response.data.data === false
      ) {
        alert("OTP is incorrect");
        setBtnIsDiabaled(false);
      } else if (
        response.data?.succeeded === true &&
        response.data?.statusCode == StatusCode.deleted &&
        response.data?.data === true
      ) {
        alert("OPT has already been used");
        setBtnIsDiabaled(false);
      } else if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.badRequest &&
        response.data?.data === false
      ) {
        alert("OPT has expired");
        setBtnIsDiabaled(false);
      } else if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.unauthorized &&
        response.data?.data === false
      ) {
        alert("Unauthorized");
        navigate("/signup", { replace: true });
        setBtnIsDiabaled(false);
      } else if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.ok &&
        response.data?.data === true
      ) {
        navigate("/login", { replace: true });
        setBtnIsDiabaled(false);
      }

      alert("error");
      setBtnIsDiabaled(false);
    } catch (err) {
      alert(err);
      setBtnIsDiabaled(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response: IResponse = await resendOtp({ token: `${token}` });
      console.log(response);

      if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.notFound
      ) {
        alert("Bad request");
        navigate("/signup");
      } else if (
        response.data?.succeeded == true &&
        response.data?.statusCode === StatusCode.duplicateRequest
      ) {
        alert("User already confirmed");
        navigate("/login");
      } else if (
        response.data?.succeeded == true &&
        response.data?.statusCode === StatusCode.deleted
      ) {
        alert("Otp Resend failed");
      } else if (
        response.data?.succeeded == true &&
        response.data?.statusCode === StatusCode.ok
      ) {
        navigate(`/verify-account/${response.data.data}`, {
          replace: true,
        });
      }
      alert("Server error");
    } catch (err) {
      alert("Something went wrong");
      console.log(err);
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
        disabled={btnIsDiabaled}
        onClick={handleSubmit}
      >
        Verify
      </Button>
      <Typography mt={4} variant={"caption"} display={"block"}>
        I didn’t receive a code <Link onClick={handleResendOtp}>Resend</Link>
      </Typography>
    </Box>
  );
};

export default VerifyAccountForm;
