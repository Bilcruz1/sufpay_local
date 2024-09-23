import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { InputFeild, PhoneNumberField } from "../..";

const AirtimeTransactions = () => {
  return (
    <Box sx={{border: "1px solid red", height: '85vh'}}>
      <Box
        sx={{
          width: { xs: "100%", sm: "50%", md: "35%" },
        }}
      >
        <Typography variant="h5">Airtime</Typography>

        {/* <Box sx={{height: 'inherit', border: "1px solid green", display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}> */}

        <Stack direction={"column"} gap={2} mt={2}>
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
            size={"small"}
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
            size={"small"}
          />
          </Stack>
          
          <Box>
            <Button>Cancel</Button>
            <Button>Proceed to payment</Button>
          </Box>
        {/* </Box> */}

      </Box>
    </Box>
  );
};

export default AirtimeTransactions;
