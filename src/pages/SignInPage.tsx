import React from "react";
import { SignUpLayout } from "../components";
import { LoginForm } from "../forms";

const SignInPage: React.FC = () => {
  return (
    <>
      <SignUpLayout header={"Sign in Sufpay"} component={<LoginForm />} />
    </>
  );
};

export default SignInPage;