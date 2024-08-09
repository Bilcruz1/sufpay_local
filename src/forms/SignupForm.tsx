import {
  Box,
  Button,
  Divider,
  Link,
  Stack,
  Typography,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import {
  InputFeild,
  PasswordChks,
  PasswordInputFeild,
  PhoneNumberField,
} from "../components";
// import CountryCodePhoneNumberField from "./CountryCodePhoneNumberField";
import googleImg from "../assets/img/google_img.svg";
import { IBasicApiResponse, IPasswordChkProps, IResponse } from "../utils/interfaces";
import {
  register,
  verifyEmailUniqueness,
  verifyPhoneNumberUniqueness
} from "../Apis/onBoardingApi";
import { signupFormDataSchema } from "./schema";

interface IForm {
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  email: string
}

const SignupForm = () => {
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [formData, setFormData] = useState<IForm>({
    firstName: "",
    lastName: "",
    countryCode: "+234",
    phoneNumber: "",
    password: "",
    email: ""
  });

  const [formErrors, setFormErrors] = useState<IForm>({
    firstName: "",
    lastName: "",
    countryCode: "",
    phoneNumber: "",
    password: "",
    email: ""
  });

  const [passwordChecks, setPasswordChecks] = useState<IPasswordChkProps>({
    charCountChk: false,
    lowerCaseChk: false,
    upperCaseChk: false,
    specialCaseChk: false,
    OneNumberChk: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = async (e: string) => {

    if (e !== null && e !== "" && e !== undefined && e.length >= 3) { 
      setFormErrors(prev => ({...prev, phoneNumber:  ""}))
      setFormErrors((prev) => ({ ...prev, email: "" }));
      if (e === "email") {
        const result: IResponse<IBasicApiResponse> = await verifyEmailUniqueness(
          { email: formData.email }
        );
        if (result.data === true) {
          setFormErrors((prev) => ({ ...prev, email: "Email already exists" }));
        }
      } else if (e === "phoneNumber") {
        const result: IResponse<IBasicApiResponse> =
          await verifyPhoneNumberUniqueness({ phoneNumber: formData.phoneNumber });
        if (result.data === true) {
          setFormErrors((prev) => ({
            ...prev,
            phoneNumber: "Phone number already exists",
          }));
        }
      }

    }
  };

  const submitForm = () => {
    setBtnDisabled(prev => true)
    setFormErrors(prev => ({
      firstName: "",
      lastName: "",
      countryCode: "",
      phoneNumber: "",
      password: "",
      email: ""
    }))

    const validationResult = signupFormDataSchema.safeParse(formData)

    if (!validationResult.success) {
      validationResult.error.errors.forEach((error) => {
        setFormErrors((prev) => ({ ...prev, [error.path[0]]: error.message }));
      })


      const response = register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.countryCode + formData.phoneNumber,
        password: formData.password,
      })


      setBtnDisabled((prev) => false)
      

    }
  }

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
            value={formData.firstName || ""}
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
        <InputFeild
          name={"email"}
          value={formData.email}
          handleChange={handleChange}
          label={"Email"}
          error={formErrors.email}
          handdleBlur={handleBlur}
        />
        <PhoneNumberField
          countryCode={formData.countryCode}
          phoneNumber={formData.phoneNumber}
          handleChange={handleChange}
          name={"phoneNumber"}
          // handleCountryCodeChange={handleCountryCodeChange}
          label={"Phone number"}
          handdleBlur={handleBlur}
          error={formErrors.phoneNumber}
        />
        <PasswordInputFeild
          name={"password"}
          value={formData.password}
          handleChange={handleChange}
          label={"Password"}
          error={formErrors.password}
        />
        <PasswordChks {...passwordChecks} />
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
