import { Box, Button, Stack } from "@mui/material";
import React, { FC, useState } from "react";
import { PasswordChks, PasswordInputFeild } from "../components";
import { passwordChangeSchema } from "./schema";
import { changePassword } from "../Apis/onBoardingApi";
import { useParams } from "react-router-dom";

interface IFormData {
  password: string;
  confirmPassword: string;
}

interface IShowPassword {
  password: boolean;
  confirmPassword: boolean;
}

export interface IPasswordChkProps {
  charCountChk: boolean;
  lowerCaseChk: boolean;
  upperCaseChk: boolean;
  specialCaseChk: boolean;
  OneNumberChk: boolean;
}

const CreateNewPasswordForm: FC = () => {
  const [showPassword, setShowPassword] = useState<IShowPassword>({
    password: false,
    confirmPassword: false,
  });
  const [btnIsClicked, setBtnIsClicked] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({
    password: "",
    confirmPassword: "",
  });

  const { token } = useParams();

  const [errors, setErrors] = useState<IFormData>({
    password: "",
    confirmPassword: "",
  });

  const [validations, setValidations] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
    hasNumber: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function submitForm() {
    setBtnIsClicked(false);
    setErrors((prev) => ({
      password: "",
      confirmPassword: "",
    }));

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    const validationResult = passwordChangeSchema.safeParse(formData);

    if (!validationResult.success) {
      validationResult.error.errors.forEach((el) => {
        setErrors((prev) => ({ ...prev, [el.path[0]]: el.message }));
      });
      setBtnIsClicked(true);
      return;
    }

    // Submit the form if valid
    const response = await changePassword({
      newPassword: formData.password,
      confirmPassword: formData.confirmPassword,
      token: token ?? "",
    });


    console.log(response)

    //chk for response

    
  }

  return (
    <Box>
      <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={1}>
        <Stack direction={"column"} gap={2}>
          <PasswordInputFeild
            name={"password"}
            value={formData.password}
            handleChange={handleChange}
            label={"Password"}
          />

          <PasswordInputFeild
            name={"confirmPassword"}
            value={formData.confirmPassword}
            handleChange={handleChange}
            label={"Confirm Password"}
          />

          <Box
            display={{ xs: "none", md: "block" }}
            textAlign={"left"}
            color={"#666666"}
          >
            <PasswordChks password={formData.password} />
          </Box>

          <Button
            sx={{
              background: "#aac645",
              borderRadius: "1rem",
              width: "100%",
              marginTop: "4rem",
            }}
            variant="contained"
            onClick={submitForm}
            size={"large"}
            disabled={btnIsClicked}
          >
            Sign in
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreateNewPasswordForm;
