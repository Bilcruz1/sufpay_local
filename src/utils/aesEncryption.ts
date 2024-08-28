// import CryptoJS from "crypto-js";

// // Key and IV from environment variables
// const key = CryptoJS.enc.Hex.parse() //CryptoJS.enc.Hex.parse(process.env.REACT_AES_Key);
// const iv = CryptoJS.enc.Base64.parse()//CryptoJS.enc.Hex.parse(process.env.REACT_AES_IV)

// console.log(key)
// // console.log(process.env.REACT_APP_AES_IV)

// // Encrypt Data
// export const encryptData = (data: {} | string) => {
//   // Encrypt data
//   const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
//     iv: iv,
//   }).toString();

//   return encrypted;
// };

// // Decrypt Data
// export const decryptData = (ciphertext: string) => {
//   // Decrypt data
//   const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
//     iv: iv,
//   }).toString(CryptoJS.enc.Utf8);

//   return JSON.parse(decrypted);
// };

// // // Usage
// // const encryptedData = encryptData(myData);
// // console.log("Encrypted Data:", encryptedData);

// // const decryptedData = decryptData(encryptedData);
// // console.log("Decrypted Data:", decryptedData);

export const decryptData = ""
