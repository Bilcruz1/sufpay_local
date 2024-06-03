import { Box, Button, Divider, InputAdornment, Link, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  InputFeild,
  PasswordChks,
  PasswordInputFeild,
  PhoneNumberField,
} from "../components";
import {
  // Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
// import CountryCodePhoneNumberField from "./CountryCodePhoneNumberField";
import googleImg from '../assets/img/google_img.svg'

interface IForm {
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
}

const SignupForm = () => {
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [formData, setFormData] = useState<IForm>({
    firstName: "",
    lastName: "",
    countryCode: "+1",
    phoneNumber: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<IForm>({
    firstName: "",
    lastName: "",
    countryCode: "",
    phoneNumber: "",
    password: "",
  });

  const handleCountryCodeChange = (e: React.ChangeEvent) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   countryCode: e.target.value as string,
    // }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log(formData);
  const submitForm = () => {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
      gap={2}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        gap={2}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <InputFeild
            name={"firstName"}
            value={formData.firstName}
            handleChange={handleChange}
            label={"First name"}
            error={formErrors.firstName}
          />
          <InputFeild
            name={"lastName"}
            value={formData.lastName}
            handleChange={handleChange}
            label={"Last name"}
            error={formErrors.lastName}
          />
        </Stack>
        <PhoneNumberField
          countryCode={formData.countryCode}
          phoneNumber={formData.phoneNumber}
          handleChange={handleChange}
          // handleCountryCodeChange={handleCountryCodeChange}
          label={"Phone number"}
          error={formErrors.phoneNumber}
        />
        <PasswordInputFeild
          name={"password"}
          value={formData.password}
          handleChange={handleChange}
          label={"Password"}
          error={formErrors.password}
        />
        <PasswordChks />
      </Box>

      <Stack direction={"column"} gap={2} mt={4}>
        <InputLabel component={"span"}>
          By creating an account, you agree to the <Link>Terms of use</Link> and{" "}
          <Link>Privacy Policy.</Link>
        </InputLabel>

        <Button
          sx={{
            background: "#aac645",
            borderRadius: "1rem",
          }}
          variant="contained"
          onClick={submitForm}
          size={"large"}
        >
          Create an account
        </Button>
        <InputLabel sx={{ textAlign: "center" }}>
          Already have an ccount? Log in <Link>Login</Link>
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
          <Typography component={"span"}>Sign up with Google</Typography>
        </Button>
      </Stack>
    </Box>
  );
};

export default SignupForm;

// import React from "react";
