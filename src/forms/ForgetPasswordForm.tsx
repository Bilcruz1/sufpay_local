import { Box, Button, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import { InputFeild, Loading } from "../components";
import { emailSchema } from "./schema";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../Apis/onBoardingApi";
import { StatusCode } from "../utils/enums";
import useNotification from "../utils/hooks/useNotification";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  
  const {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
  } = useNotification();

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
        setBtnDisabled(false);
        showSuccessNotification("Otp sent to your email")
        return navigate("/", { replace: true })
      } else if (response.data.succeeded && response.data.statusCode === StatusCode.unauthorized && response.data.data === null || response.data.data === typeof (String)) {
        setBtnDisabled(false);
        showWarningNotification("Verify account. Otp sent to your email address");
        return navigate("/", { replace: true })
      } else if (response.data.succeeded && response.data.statusCode === StatusCode.ok) {
        setBtnDisabled(false);
        showSuccessNotification("Otp sent to your email");
        return navigate(`/forget-password/${response.data.data}`, { replace: true })
      } else if (response.data.succeeded && response.data.statusCode === StatusCode.internalServerError) {
        setBtnDisabled(false);
        showErrorNotification();
        return
      } else {
        setBtnDisabled(false);
        showWarningNotification("Something went wrong")
        return navigate(-1)
      }
      setBtnDisabled(false);
    } catch (err) {
      showErrorNotification();
      setBtnDisabled(false);
      return navigate(-1)
    }
  }

  if (btnDisabled) {
    return <Loading isLoading={btnDisabled} height="100%" width="100%" />;
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
        <Typography
          textAlign={"center"}
          mt={4}
          variant="caption"
          display="block"
        >
          Remember password?{" "}
          <Link onClick={() => navigate("/login", { replace: true })}>
            Log in
          </Link>
        </Typography>
      </Box>
    );
};

export default ForgetPasswordForm;
