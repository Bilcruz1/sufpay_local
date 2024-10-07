import React from 'react'
import { Loading, SignUpLayout } from '../components'
import { SignupForm } from '../forms';

const SignUpPage = () => {
  const [btnDisabled, setBtnDisabled] = React.useState<boolean>(false)

  return (
    <div>
      <SignUpLayout
        header={"Sign up to Sufpay"}
        component={
          !btnDisabled ? (
            <SignupForm
              btnDisabled={btnDisabled}
              setBtnDisabled={setBtnDisabled}
            />
          ) : (
            <Loading isLoading={btnDisabled} height="100%" width="100%" />
          )
        }
      />
    </div>
  );
}

export default SignUpPage