// import CryptoJS from "crypto-js";


// // export const encryptData = (
// //   data: {} | string,
// //   secretKey: string = process.env.REACT_APP_AES_KEY
// // ) => {
// //   const ciphertext = CryptoJS.AES.encrypt(
// //     JSON.stringify(data),
// //     secretKey
// //   ).toString();
// //   return ciphertext;
// // };

// // export const decryptData = (
// //   ciphertext: string,
// //   secretKey: string = process.env.REACT_APP_AES_KEY
// // ) => {
// //   const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
// //   const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
// //   return JSON.parse(decryptedText);
// // };

// export const encryptData = (
//   data: {} | string,
//   secretKey: string = process.env.REACT_APP_AES_KEY || ""
// ) => {
//   if (!secretKey) {
//     throw new Error(
//       "Encryption key is missing. Ensure REACT_APP_AES_KEY is set."
//     );
//   }
//   const ciphertext = CryptoJS.AES.encrypt(
//     JSON.stringify(data),
//     secretKey
//   ).toString();
//   return ciphertext;
// };

// export const decryptData = (
//   ciphertext: string,
//   secretKey: string = process.env.REACT_APP_AES_KEY || ""
// ) => {
//   if (!secretKey) {
//     throw new Error(
//       "Decryption key is missing. Ensure REACT_APP_AES_KEY is set."
//     );
//   }
//   const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
//   const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
//   return JSON.parse(decryptedText);
// };

import CryptoJS from "crypto-js";

// Function to derive a key using PBKDF2 (similar to Rfc2898DeriveBytes)
const deriveKey = (
  passphrase: string,
  salt: string,
  iterations: number,
  keySize: number
) => {
  return CryptoJS.PBKDF2(passphrase, CryptoJS.enc.Utf8.parse(salt), {
    keySize: keySize / 32,
    iterations: iterations,
  });
};

// Encrypt Data
export const encryptData = (
  data: {} | string,
  passphrase: string,
  saltValue: string,
  initVector: string,
  iterations: number,
  keySize: number
) => {
  // Derive key
  const key = deriveKey(passphrase, saltValue, iterations, keySize);

  // Encrypt data
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: CryptoJS.enc.Utf8.parse(initVector),
  }).toString();

  return encrypted;
};

// Decrypt Data
export const decryptData = (
  ciphertext: string,
  passphrase: string,
  saltValue: string,
  initVector: string,
  iterations: number,
  keySize: number
) => {
  // Derive key
  const key = deriveKey(passphrase, saltValue, iterations, keySize);

  // Decrypt data
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: CryptoJS.enc.Utf8.parse(initVector),
  }).toString(CryptoJS.enc.Utf8);

  return JSON.parse(decrypted);
};


// const encryptedData = encryptData(
//   myData,
//   process.env.REACT_APP_PASSPHRASE,
//   process.env.REACT_APP_SALT_VALUE,
//   process.env.REACT_APP_INIT_VECTOR,
//   parseInt(process.env.REACT_APP_PASSWORD_ITERATIONS),
//   parseInt(process.env.REACT_APP_BLOCKSIZE)
// );

// const decryptedData = decryptData(
//   encryptedData,
//   process.env.REACT_APP_PASSPHRASE,
//   process.env.REACT_APP_SALT_VALUE,
//   process.env.REACT_APP_INIT_VECTOR,
//   parseInt(process.env.REACT_APP_PASSWORD_ITERATIONS),
//   parseInt(process.env.REACT_APP_BLOCKSIZE)
// );

