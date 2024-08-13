
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

export interface IResponse {
  error: string[] | null;
  data: IBasicApiResponse | IApiResponse;
}

export interface IBasicApiResponse {
  succeeded: boolean;
  message: string;
  errors: string[];
  statusCode: StatusCode;
  data?: {} | [] | null | boolean;
}

export interface IApiResponse extends IBasicApiResponse {
  data: {} | [] | null | any;
}
