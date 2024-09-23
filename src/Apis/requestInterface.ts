

export interface IVerifyEmailUniqueness {
  email: string;
}

export interface IVerifyPhoneNumberUniqueness {
    phoneNumber: string
}

export interface ISigupForm {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    email: string;
}

export interface IVerifyAccount {
  otp: string;
  otpToken: string;
}

export interface IResendOtp {
  token: string
}

export interface ILogin {
  emailAddress: string,
  password: string
}
