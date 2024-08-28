import { Box, Typography } from "@mui/material";
import React from "react";
import { InputFeild, PhoneNumberField } from "../..";

const AirtimeTransactions = () => {
  return (
    <Box>
      <Box>
        <Typography variant="h5">Airtime</Typography>
        <PhoneNumberField
          countryCode={""}
          phoneNumber={""}
          name={"phoneNumber"}
          handleChange={function (
            e: React.ChangeEvent<HTMLInputElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          label={"Phone Number"}
        />
        <InputFeild
          name={"amount"}
          value={""}
          handleChange={function (
            e: React.ChangeEvent<HTMLInputElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          label={"Amount"}
        />
      </Box>
    </Box>
  );
};

export default AirtimeTransactions;
