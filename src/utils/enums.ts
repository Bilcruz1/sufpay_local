export enum StatusCode {
  ok = 0,
  created = 1,
  updated = 2,
  deleted = 3,
  notFound = 4,
  badRequest = 5,
  unauthorized = 6,
  duplicateRequest = 7,
  internalServerError = 8,
}

export enum PasswordChkProperties {
  PasswordCount,
  upperCaseChk,
  lowerCaseChk,
  specialCharChk,
  OneNumberChk,
}
