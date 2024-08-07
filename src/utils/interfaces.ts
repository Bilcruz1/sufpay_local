
import { Link } from '@mui/material';
import { StatusCode } from './enums';


export interface IPasswordChkProps {
  charCountChk: boolean;
  lowerCaseChk: boolean;
  upperCaseChk: boolean;
  specialCaseChk: boolean;
  OneNumberChk: boolean;
}

export interface ISocials {
  title: string;
  link: string;
  icon: string;
}

export interface IServices {
  title: string;
  content: string
  img: string
}

export interface INavList {
  title: string;
  link: string;
}

export interface IHeaderProps{
  id: string
}

export interface IContatctUsForm{
  name: string;
  email: string;
  message: string;
}

// export interface IResponse<T> {
//   error: string[];
//   data?: IBasicApiResponse | IApiResponse<T> | null;
// }

// export interface IBasicApiResponse {
//   succeeded: boolean;
//   message: string;
//   errors: string[];
//   statusCode: StatusCode;
// }

// export interface IApiResponse<T> extends IBasicApiResponse {
//   data: T;
// }



// export interface IResponse<T = any> {
//   // Default to 'any' if no type is specified
//   error: string[] | null;
//   data?: T | null;
// }

// export interface IBasicApiResponse {
//   succeeded: boolean;
//   message: string;
//   errors: string[];
//   statusCode: StatusCode;
// }

// export interface IApiResponse<T = any> extends IBasicApiResponse {
//   data: T;
// }


export interface IResponse<T = any> {
  error: string[] | null;
  data: T | null | any;
}

export interface IBasicApiResponse {
  succeeded: boolean;
  message: string;
  errors: string[];
  statusCode: StatusCode;
}

export interface IApiResponse<T = any> extends IBasicApiResponse {
  data: T;
}
