import React from 'react'
import { SignUpLayout } from '../components';
import { ForgetPasswordForm } from '../forms';

const ForgetPasswordPage = () => {
  return (
    <div>
      <SignUpLayout
        header={"Forgot Password"}
        component={<ForgetPasswordForm />}
      />
    </div>
  );
}

export default ForgetPasswordPage