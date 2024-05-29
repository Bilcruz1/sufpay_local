import React from "react";
import { SignUpLayout } from "../components";
import { SignupForm } from "../forms";

const SignInPage: React.FC = () => {
  return (
    <>
      <SignUpLayout header={"Sign in Sufpay"} component={<SignupForm />} />
    </>
  );
};

export default SignInPage;