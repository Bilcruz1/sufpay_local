


const httpBrowserLanguage = navigator.language;
const httpBrowserJavaEnabled = navigator.javaEnabled();
const httpBrowserColorDepth = screen.colorDepth;
const httpBrowserScreenHeight = screen.height;
const httpBrowserScreenWidth = screen.width;
const userAgentBrowserValue = navigator.userAgent;
const deviceChannel = /Mobi|Android/i.test(navigator.userAgent)
  ? "Mobile"
  : "Desktop";

export const clientDetails = {
  httpBrowserLanguage,
  httpBrowserJavaEnabled,
  httpBrowserColorDepth,
  httpBrowserScreenHeight,
  httpBrowserScreenWidth,
  userAgentBrowserValue,
  deviceChannel,
}




// import React, { useState, useEffect } from "react";

// const BrowserInfo = () => {
//   const [browserInfo, setBrowserInfo] = useState({
//     httpBrowserLanguage: "",
//     httpBrowserJavaEnabled: false,
//     httpBrowserColorDepth: "",
//     httpBrowserScreenHeight: "",
//     httpBrowserScreenWidth: "",
//     userAgentBrowserValue: "",
//     deviceChannel: "",
//   });

//   useEffect(() => {
//     // Gather browser information
//     const getBrowserInfo = () => {
//       const httpBrowserLanguage = navigator.language;
//       const httpBrowserJavaEnabled = navigator.javaEnabled();
//       const httpBrowserColorDepth = screen.colorDepth;
//       const httpBrowserScreenHeight = screen.height;
//       const httpBrowserScreenWidth = screen.width;
//       const userAgentBrowserValue = navigator.userAgent;
//       const deviceChannel = /Mobi|Android/i.test(navigator.userAgent)
//         ? "Mobile"
//         : "Desktop";

//       setBrowserInfo({
//         httpBrowserLanguage,
//         httpBrowserJavaEnabled,
//         httpBrowserColorDepth,
//         httpBrowserScreenHeight,
//         httpBrowserScreenWidth,
//         userAgentBrowserValue,
//         deviceChannel,
//       });
//     };

//     getBrowserInfo();
//   }, []); // Run once on component mount

//   return (
//     <div>
//       <h3>Browser Information</h3>
//       <ul>
//         <li>Language: {browserInfo.httpBrowserLanguage}</li>
//         <li>
//           Java Enabled: {browserInfo.httpBrowserJavaEnabled ? "Yes" : "No"}
//         </li>
//         <li>Color Depth: {browserInfo.httpBrowserColorDepth}</li>
//         <li>Screen Height: {browserInfo.httpBrowserScreenHeight}</li>
//         <li>Screen Width: {browserInfo.httpBrowserScreenWidth}</li>
//         <li>User Agent: {browserInfo.userAgentBrowserValue}</li>
//         <li>Device Channel: {browserInfo.deviceChannel}</li>
//       </ul>
//     </div>
//   );
// };

// export default BrowserInfo;

