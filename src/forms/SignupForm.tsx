import {
  Box,
  Button,
  Divider,
  InputLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import googleImg from "../assets/img/google_img.svg";
import { InputFeild, PasswordInputFeild } from "../components";

interface IFormData {
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitForm = () => {
    console.log(formData);
  };

  return (
    <Box>
      <Stack direction={"column"} gap={2}>
        <InputFeild
          name={"credentials"}
          label={"Phone number or email address"}
          value={""}
          handleChange={() => {}}
        />

        {/* password */}
        <PasswordInputFeild
          name={"password"}
          label={"Your password"}
          value={""}
          handleChange={() => {}}
        />

        <Box textAlign={"end"} mt={-1}>
          <Link>Forget your password?</Link>
        </Box>

        <Button
          sx={{
            background: "#aac645",
            borderRadius: "1rem",
            // paddingY: ".75rem",
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
        >
          <img src={googleImg} alt="google" />
          <Typography component={"span"}>Continue with Google</Typography>
        </Button>
      </Stack>
    </Box>
  );
};

export default SignupForm;
