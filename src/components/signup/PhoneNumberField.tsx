import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";

interface ICountryCodeProps {
  countryCode: string;
  phoneNumber: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   handleCountryCodeChange: (e: React.ChangeEvent) => void;
  label: string;
  error?: string;
}

const PhoneNumberField: React.FC<ICountryCodeProps> = ({
  countryCode,
  phoneNumber,
  handleChange,
//   handleCountryCodeChange,
  label,
  error,
}) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      gap={1}
      textAlign={"left"}
    >
      <InputLabel htmlFor="phoneNumber">{label}</InputLabel>
      <TextField
        id="phoneNumber"
        variant="outlined"
        onChange={handleChange}
        name="phoneNumber"
        value={phoneNumber}
        error={!!error}
        helperText={error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 50,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <Select
                  value={countryCode}
                //   onChange={handleCountryCodeChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Country Code" }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  }}
                >
                  <MenuItem value="+1">+1</MenuItem>
                  <MenuItem value="+91">+91</MenuItem>
                  <MenuItem value="+44">+44</MenuItem>
                </Select>
              </FormControl>
            </InputAdornment>
          ),
        }}
        sx={{ flex: 1, ml: 1 }}
      />
    </Box>
  );
};

export default PhoneNumberField;