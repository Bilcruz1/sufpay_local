import React from 'react'
import { SignUpLayout } from '../components'
import { SignupForm } from '../forms';

const SignUpPage = () => {
  return (
    <div>
      <SignUpLayout header={"Sign up to Sufpay"} component={<SignupForm />} />
    </div>
  );
}

export default SignUpPage