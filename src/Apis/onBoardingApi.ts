import {
  IApiResponse,
  IBasicApiResponse,
  IResponse,
} from "../utils/interfaces";
import http, { handleApiError } from "./httpService";


export const register = async (
  data: any
): Promise<IResponse<IBasicApiResponse>> => {
  try {
    const res: IBasicApiResponse = await http.post(
      "/Authentication/register",
      data
    );
    if (res.succeeded) {
      return { error: null, data: res };
    } else {
      return { error: res.errors, data: null };
    }
  } catch (err) {
    return handleApiError(err);
  }
};

// export const verifyPhoneNumberUniqueness = async (data: any): Promise<IResponse> => {
//   try {
//     const res: IApiResponse<boolean> = await http.post(
//       "/Authentication/verify-phone-uniqueness",
//       data
//     );
//     return { error: null, data: res.data };
//   } catch (err) {
//     return handleApiError(err);
//   }
// };

export const verifyPhoneNumberUniqueness = async (
  data: string
): Promise<IResponse<IApiResponse>> => {
  try {
    const res: IApiResponse<boolean> = await http.post(
      "/Authentication/verify-phone-uniqueness",
      data
    );
    return { error: null, data: res.data };
  } catch (err) {
    return handleApiError(err);
  }
};

export const verifyEmailUniqueness = async (data: string): Promise<IResponse<IApiResponse>> => {
  try {
    const res: IApiResponse<boolean> = await http.post(
      "/Authentication/verify-email-uniqueness",
      data
    );
    console.log(res, "data")
    return { error: null, data: res.data };
  } catch (err) {
    console.log(err, "exception")
    return handleApiError(err);
  }
};

// export const loginUser = async (data: any): Promise<IResponse> => {
//   try {
//     const res = await http.post("/Authentication/login", data);
//     return { error: null, data: res.data };
//   } catch (err) {
//     return handleApiError(err);
//   }
// };

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

// export const forgotPassword = async (data: any): Promise<IResponse> => {
//   try {
//     const res = await http.post("/authentication/forgot-password", data);
//     return { error: null, data: res.data };
//   } catch (err) {
//     return handleApiError(err);
//   }
// };

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

// export const resendOtp = async (data: string): Promise<IResponse> => {
//   try {
//     const res = await http.post("/authentication/resend-otp", data);
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

// export const completeVerification = async (data: string): Promise<IResponse> => {
//   try {
//     const res = await http.post("/authentication/complete-verification", data);
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
