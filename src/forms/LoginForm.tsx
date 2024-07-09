import {
  Box,
  Button,
  Divider,
  InputLabel,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import googleImg from "../assets/img/google_img.svg";
import { InputFeild, PasswordInputFeild } from "../components";
import { formDataSchema } from './schema'

interface IFormData {
  credentials: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    credentials: "",
    password: "",
  });
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false)

  const [error, setErrors] = useState<IFormData>({
    credentials: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitForm = () => {
    setBtnDisabled(true)
    setErrors(prev => ({
      credentials: "",
      password: "",
    }));
    
    //validation
    const validationResult = formDataSchema.safeParse(formData);

    if (!validationResult.success) {
      validationResult.error.errors.forEach(el => {
        setErrors(prev => ({ ...prev, [el.path[0]]: el.message }))
      })
      setBtnDisabled(true)
      return
    }

    // api calls
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "space-between", md: "center" },
          flexDirection: "column",
          minHeight: { xs: "70vh" },
        }}
        gap={2}
      >
        <Stack direction={"column"} gap={2}>
          <InputFeild
            name={"credentials"}
            label={"Phone number or email address"}
            value={formData.credentials}
            handleChange={handleChange}
            error={error.credentials}
          />

          {/* password */}
          <PasswordInputFeild
            name={"password"}
            label={"Your password"}
            value={formData.password}
            handleChange={handleChange}
            error={error.password}
          />

          <Box textAlign={"end"} mt={-1}>
            <Link>Forget your password?</Link>
          </Box>
        </Stack>

        {/* buttom half */}
        <Stack direction={"column"} gap={2}>
          <Button
            sx={{
              background: "#aac645",
              borderRadius: "1rem",
            }}
            variant="contained"
            onClick={submitForm}
            size={"large"}
          >
            Sign in
          </Button>
          <InputLabel sx={{ textAlign: "center" }}>
            Don't have an account? <Link>Sign up</Link>
          </InputLabel>

          <Box
            mt={4}
            display={"flex"}
            width={"100%"}
            justifyContent={"sapce-between"}
            alignItems={"center"}
            gap={2}
          >
            <Box width={"100%"}>
              <Divider />
            </Box>
            <Typography component={"span"}>OR</Typography>
            <Box width={"100%"}>
              <Divider />
            </Box>
          </Box>
          <Button
            sx={{
              borderRadius: "1rem",
              marginTop: "2rem",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
            variant="outlined"
            onClick={submitForm}
            size="large"
            disabled={btnDisabled}
          >
            <img src={googleImg} alt="google" />
            <Typography component={"span"}>Continue with Google</Typography>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginForm;
