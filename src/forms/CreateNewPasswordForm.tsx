import { Box, Button, Stack } from "@mui/material";
import React, { FC, useState } from "react";
import { Loading, PasswordChks, PasswordInputFeild } from "../components";
import { passwordChangeSchema } from "./schema";
import { changePassword } from "../Apis/onBoardingApi";
import { useParams, useNavigate } from "react-router-dom";
import { StatusCode } from "../utils/enums";
import useNotification from "../utils/hooks/useNotification";


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
  const {
    showWarningNotification,
    showErrorNotification,
    showSuccessNotification,
  } = useNotification();
  const navigate = useNavigate();

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

    try {
 const response = await changePassword({
      newPassword: formData.password,
      confirmPassword: formData.confirmPassword,
      token: token ?? "",
    });


    if (
      response.data?.succeeded &&
      response.data?.data === false &&
      response.data?.statusCode === StatusCode.notFound) {
        showWarningNotification("Sign up is required. Please sign up");
        setBtnIsClicked(false)
        return navigate("/signup", { replace: true })
    } else if (
      response.data?.succeeded &&
      response.data?.data === false &&
      response.data?.statusCode === StatusCode.unauthorized
    ) {
        showWarningNotification("Login is required. Please login")
        setBtnIsClicked(false)
        return navigate("/signup", { replace: true });
    } else if (
      response.data?.succeeded &&
      response.data?.data === true &&
      response.data?.statusCode === StatusCode.ok
    ) {
       showWarningNotification("Sign up is required. Please sign up");
       setBtnIsClicked(false);
       return navigate("/login", { replace: true });
    }else if (
      response.data?.succeeded &&
      response.data?.data === true &&
      response.data?.statusCode === StatusCode.internalServerError
    ) {
        showWarningNotification("Token expired. Please login");
        setBtnIsClicked(false);
        return navigate("/login", { replace: true });
    } else {
      showWarningNotification("Something went wrong")
      setBtnIsClicked(false)
      return navigate(-1)
    }
    } catch (err) {
      showErrorNotification()
       setBtnIsClicked(false);
       return navigate("/login", { replace: true })
    }
  }

  if (btnIsClicked) return <Loading isLoading={btnIsClicked} />;
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
