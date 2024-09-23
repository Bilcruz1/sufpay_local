import { Box, Button, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import { InputFeild } from "../components";
import { emailSchema } from "./schema";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../Apis/onBoardingApi";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const navigate = useNavigate()
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail((prev) => value);
  }

  const submitForm = async () => {
    //form submition
    setBtnDisabled(true);
    setError(prev => "")
    const validationResult = emailSchema.safeParse(email);

    if (!validationResult.success) {
      validationResult.error.errors.forEach((el) => {
        setError(el.message);
      });
      setBtnDisabled(false);
    }

    try {
      const response = await forgotPassword({ email: email })
      console.log(response);
      setBtnDisabled(true);
    } catch (err) {
      setBtnDisabled(true);
    }
  }

  return (
    <Box>
      <InputFeild
        name={"email"}
        value={email}
        handleChange={handleChange}
        label={"Email address"}
        error={error}
      />
      <Button
        sx={{
          background: "#aac645",
          borderRadius: "1rem",
          width: "100%",
          marginTop: "2rem",
        }}
        variant="contained"
        onClick={submitForm}
        size={"large"}
        disabled={btnDisabled}
      >
        Send code
      </Button>
      <Typography textAlign={"center"} mt={4} variant="caption" display="block">
        Remember password? <Link onClick={() => navigate("/login", {replace: true})}>Log in</Link>
      </Typography>
    </Box>
  );
};

export default ForgetPasswordForm;
