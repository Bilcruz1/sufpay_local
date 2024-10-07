import React from 'react'
import { StatusCode } from '../enums';
import { useNavigate } from 'react-router-dom';
import { IResponse } from '../interfaces';
import { resendOtp, validateToken } from '../../Apis/onBoardingApi';
import useNotification from './useNotification';

const useTokenValidation = () => {

  const navigate = useNavigate()
  const {
    showSuccessNotification,
    showErrorNotification,
    showInfoNotification,
    showWarningNotification
  } = useNotification();

 async function handleTokenValidation(
   token: string,
   setShowLoadingPage: (value: boolean) => void
 ): Promise<IResponse> {
   try {
     const response: IResponse = await validateToken({ token: `${token}` });
     console.log(response);
     if (
       response.data?.succeeded === true &&
       response.data?.statusCode === StatusCode.notFound &&
       response.data.data === false
     ) {
       showWarningNotification("Sign up is required. Please sign up");
       navigate("/signup", { replace: true });
     } else if (
       response.data?.succeeded === true &&
       response.data?.statusCode === StatusCode.deleted &&
       response.data?.data === false
     ) {
       showWarningNotification("Token expired. Please login");
       navigate("/login", { replace: true });
     } else if (
       response.data?.succeeded === true &&
       response.data?.statusCode === StatusCode.badRequest &&
       response.data?.data === false
     ) {
       showWarningNotification("Otp timed out");
       navigate(`/resend-otp/${token}`);
     } else if (
       response.data?.succeeded === true &&
       response.data?.statusCode === StatusCode.ok &&
       response.data.data === true
     ) {
        showSuccessNotification();
       setShowLoadingPage(false);
     }

     return response;
   } catch (err) {
     showErrorNotification();
     console.log(err);
     return {
       error: null,
       data: {
         succeeded: false,
         message: "Failed",
         errors: [],
         statusCode: StatusCode.internalServerError,
         data: null,
       },
     };
   }
  }
  
   const handleResendOtp = async (token: string) => {
     try {
       const response: IResponse = await resendOtp({ token: `${token}` });
       console.log(response);

       if (
         response.data?.succeeded === true &&
         response.data?.statusCode === StatusCode.notFound
       ) {
         alert("Bad request");
         navigate("/signup");
       } else if (
         response.data?.succeeded == true &&
         response.data?.statusCode === StatusCode.duplicateRequest
       ) {
         alert("User already confirmed");
         navigate("/login");
       } else if (
         response.data?.succeeded == true &&
         response.data?.statusCode === StatusCode.deleted
       ) {
         alert("Otp Resend failed");
       } else if (
         response.data?.succeeded == true &&
         response.data?.statusCode === StatusCode.ok
       ) {
         navigate(`/verify-account/${response.data.data}`, {
           replace: true,
         });
       }
       alert("Server error");
     } catch (err) {
       alert("Something went wrong");
       console.log(err);
     }
   };

  return { handleTokenValidation, handleResendOtp };
}

export default useTokenValidation