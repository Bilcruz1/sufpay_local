import {
  IResponse,
} from "../utils/interfaces";
import http, { handleApiError } from "./httpService";
import { IChangePassword, ILogin, IResendOtp, ISigupForm, IValidateToken, IVerifyAccount, IVerifyEmailUniqueness, IVerifyPhoneNumberUniqueness } from "./requestInterface";


export const register = async (
  data: ISigupForm
): Promise<IResponse> => {
  try {
    const res = await http.post(
      "/Authentication/register",
      data
    )
    if (res.status >= 200  && res.status < 300) {
      return { error: null, data: res.data };
    } 
      return { error: res.data.errors || "An error occurred", data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
}

export const verifyPhoneNumberUniqueness = async (
  data: IVerifyPhoneNumberUniqueness
): Promise<IResponse> => {
  try {
    const res = await http.post(
      "/Authentication/verify-phone-uniqueness",
      data
    );
   if (res.status >= 200  && res.status < 300) {
      return { error: null, data: res.data };
    } 
        
      return { error: res.data.errors || "An error occurred", data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
};

export const verifyEmailUniqueness = async (
  data: IVerifyEmailUniqueness
): Promise<IResponse> => {
  try {
    const res = await http.post(
      "/Authentication/verify-email-uniqueness",
      data
    );
    if (res.status >= 200 && res.status < 300) {
      return { error: null, data: res.data };
    } 
    return { error: res.data.errors || "An error occurred", data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
};

export const validateToken = async (data: IValidateToken): Promise<IResponse> => {
  try {
    const res = await http.post("/Authentication/validate-token", data);
    if (res.status >= 200 && res.status < 300) {
      return { error: null, data: res.data };
    }
    return { error: res.data.errors || "An error occurred", data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
};

export const completeVerification = async (
  data: IVerifyAccount
): Promise<IResponse> => {
  console.log(data)
  try {
    const res = await http.post("/authentication/complete-verification", data);
    if (res.status >= 200 && res.status < 300) {
      return { error: null, data: res.data };
    } 
     return { error: res.data.errors || "An error occurred", data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
};

export const resendOtp = async (data: IResendOtp): Promise<IResponse> => {
  try {
    const res = await http.post("/authentication/resend-otp", data);
    return { error: null, data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
}

export const loginUser = async (data: ILogin): Promise<IResponse> => {
  try {
    const res = await http.post("/Authentication/login", data);
    return { error: null, data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
}

export const forgotPassword = async (data: {email: string}): Promise<IResponse> => {
  try {
    const res = await http.post(
      "/Authentication/forgot-password-request",
      data
    );
    if (res.status >= 200  && res.status < 300) {
      return { error: null, data: res.data };
    } 
      return { error: res.data.errors || "An error occurred", data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
}

export const resetPasswordOtp = async (data: {
  otp: string;
  token: string;
}): Promise<IResponse> => {
  try {
    const res = await http.post("/Authentication/reset-password-otp", data);
    if (res.status >= 200 && res.status < 300) {
      return { error: null, data: res.data };
    }
    return { error: res.data.errors || "An error occurred", data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
};

export const changePassword = async (data: IChangePassword): Promise<IResponse> => {
  try {
    const res = await http.post(
      "/Authentication/forgot-password",
      data
    );
    if (res.status >= 200 && res.status < 300) {
      return { error: null, data: res.data };
    }
    return { error: res.data.errors || "An error occurred", data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
}


// export const logoutUser = async (data: any): Promise<IResponse> => {
//   try {
//     const res = await http.post("/Authentication/logout", data);
//     return { error: null, data: res.data };
//   } catch (err) {
//     return handleApiError(err);
//   }
// };

// // export const logoutUser = async (data: any): Promise<IResponse> => {
// //   try {
// //     const res = await http.post("/Authentication/logout", data);
// //     return { error: null, data: res.data };
// //   } catch (err) {
// //     return handleApiError(err);
// //   }
// // };



// export const twofactorAuth = async (data: string): Promise<IResponse> => {
//   try {
//     const res = await http.post("/authentication/2fa/{data}");
//     return { error: null, data: res.data };
//   } catch (err) {
//     return handleApiError(err);
//   }
// };

// export const resetPassword = async (data: string): Promise<IResponse> => {
//   try {
//     const res = await http.post("/authentication/reset-password");
//     return { error: null, data: res.data };
//   } catch (err) {
//     return handleApiError(err);
//   }
// };



// export const initaiteVerification = async (data: string): Promise<IResponse> => {
//   try {
//     const res = await http.post("/authentication/initiate-verification", data);
//     return { error: null, data: res.data };
//   } catch (err) {
//     return handleApiError(err);
//   }
// };



// export const twoFactorLogin = async (data: string): Promise<IResponse> => {
//   try {
//     const res = await http.post("/authentication/2fa-Login", data);
//     return { error: null, data: res.data };
//   } catch (err) {
//     return handleApiError(err);
//   }
// };
