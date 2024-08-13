import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import {useParams} from "react-router-dom"
import { completeVerification } from "../Apis/onBoardingApi";
import {useNavigate} from "react-router-dom"
import {IResponse} from '../utils/interfaces'
import { StatusCode } from "../utils/enums";

const VerifyAccountForm: React.FC = () => {
  const [values, setValues] = useState<string[]>(Array(5).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [btnIsDiabaled, setBtnIsDiabaled] = useState<boolean>(false)
  const { userId } = useParams()
  const navigate = useNavigate()

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
    setBtnIsDiabaled(true)
    if (values.length < 5)
      alert("incomplete")

    const response: IResponse = await completeVerification({ otp: `${values.join("")}`, isEmailVerification: true })
    console.log(response)

    if (
      response.data?.succeeded === false &&
      response.data?.statusCode == StatusCode.badRequest &&
      response.error !== null
    ) {
      alert("oops something went wrong");
      setBtnIsDiabaled(false);
    } else if (response.data?.statusCode == StatusCode.deleted) {
      alert(response.data?.errors[0]);
      setBtnIsDiabaled(false);
    } else if (response.data?.succeeded === true && response.data?.statusCode === StatusCode.ok){
      navigate("/login");
    }

    console.log()

  }

  const handleResendOtp = () => {

  }

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
