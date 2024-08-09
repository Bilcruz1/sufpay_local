

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