import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { completeVerification } from "../Apis/onBoardingApi";
import { useNavigate } from "react-router-dom";
import { IResponse } from "../utils/interfaces";
import { StatusCode } from "../utils/enums";
import useTokenValidation from "../utils/hooks/useTokenValidation";

interface IProps {
  btnIsDisabled: boolean;
  setBtnIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const VerifyAccountForm: React.FC<IProps> = ({
  btnIsDisabled,
  setBtnIsDisabled,
}) => {
  const [values, setValues] = useState<string[]>(Array(5).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Option 1: Provide a default value
  const { token = "" } = useParams<{ token?: string }>();

  // Option 2: Use a type assertion (ensure token is present)
  // const { token } = useParams<{ token: string }>();

  const navigate = useNavigate();
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
    } else if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleSubmit = async () => {
    setBtnIsDisabled(true);
    if (values.join("").length < 5) {
      alert("Input a valid OTP");
      setBtnIsDisabled(false);
      return;
    }

    try {
      const response: IResponse = await completeVerification({
        otp: values.join(""),
        otpToken: token, // token can be an empty string or the actual token
      });

      if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.notFound &&
        response.data.data === false
      ) {
        setValues(Array(5).fill(""));
        alert("OTP is incorrect");
      } else if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.deleted &&
        response.data?.data === true
      ) {
        navigate("/login", { replace: true });
        alert("OTP has already been used");
      } else if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.badRequest &&
        response.data?.data === false
      ) {
        navigate(`resend-otp/${token}`, { replace: true });
        alert("OTP has expired");
      } else if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.unauthorized &&
        response.data?.data === false
      ) {
        alert("Unauthorized");
        navigate("/signup", { replace: true });
      } else if (
        response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.ok &&
        response.data?.data === true
      ) {
        navigate("/login", { replace: true });
      }

      setBtnIsDisabled(false);
    } catch (err) {
      alert(err);
      setBtnIsDisabled(false);
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
        disabled={btnIsDisabled}
        onClick={handleSubmit}
      >
        Verify
      </Button>
      <Typography
        mt={2}
        variant={"caption"}
        display={"block"}
        sx={{ textAlign: "center" }}
      >
        I didn’t receive a code{" "}
        <Link onClick={() => handleResendOtp(token)}>Resend</Link>
      </Typography>
    </Box>
  );
};

export default VerifyAccountForm;
