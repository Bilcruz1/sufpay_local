import CryptoJS from "crypto-js";

// Ensure the environment variables are defined and fallback to an empty string if not
const aesKey = process.env.REACT_APP_AES_Key;
const aesIv = process.env.REACT_APP_AES_IV;

if (!aesKey || !aesIv) {
  throw new Error("AES Key or IV is not defined in the environment variables.");
}

const key = CryptoJS.enc.Base64.parse(aesKey); // Use Base64 parse since your key and IV are in Base64 format
const iv = CryptoJS.enc.Base64.parse(aesIv);

export const encryptData = (data: {} | string) => {
  // Encrypt data
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
  }).toString();

  return encrypted;
};

export const decryptData = (ciphertext: string) => {
  try {
    // Decrypt data
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: iv,
    }).toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Decryption failed or produced an empty result.");
    }

    // Parse JSON only if decryption was successful
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Error during decryption:", error);
    return null; // or handle the error as needed
  }
};


// export function toUrlSafeBase64(base64String: string) {
//   return base64String
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// }

// export function fromUrlSafeBase64(urlSafeBase64: string) {
//   let base64String = urlSafeBase64.replace(/-/g, "+").replace(/_/g, "/");
//   const padLength = base64String.length % 4;
//   if (padLength > 0) {
//     base64String += "=".repeat(4 - padLength);
//   }
//   return base64String;
// }
