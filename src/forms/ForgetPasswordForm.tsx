import { Box, Button, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import { InputFeild } from "../components";
import { emailSchema } from "./schema";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../Apis/onBoardingApi";
import { StatusCode } from "../utils/enums";

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

      if (response.data?.succeeded && response.data.statusCode === StatusCode.notFound) {
        return navigate("/signup")
      } else if (response.data?.succeeded && response.data.statusCode === StatusCode.unauthorized && response.data.data !== null) {
        alert("oops an error occured")
        return navigate("/login")
      } else if (response.data.succeeded && response.data.statusCode === StatusCode.unauthorized && response.data.data !== null) { 
        alert("Please confirm your email address")
        return navigate("/verify-account/response.data.data");
      } else if (response.data.succeeded && response.data.statusCode === StatusCode.ok) {
        alert("Please check your email for the reset code")
        return navigate(`/forget-password/${response.data.data}`)
      } else if (response.data.succeeded && response.data.statusCode === StatusCode.internalServerError) {
        alert("Oops something went wrong. Please try again")
      } else {
        return navigate(-1)
      }
      setBtnDisabled(false);
    } catch (err) {
      alert("error!!!")
      setBtnDisabled(false);
      return navigate(-1)
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
