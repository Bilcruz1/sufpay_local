import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";

interface ICountryCodeProps {
  countryCode: string;
  phoneNumber: string;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  //   handleCountryCodeChange: (e: React.ChangeEvent) => void;
  label: string;
  error?: string;
  handdleBlur?: (e: string) => void;
  size?: "small" | "medium" | undefined;
}

const PhoneNumberField: React.FC<ICountryCodeProps> = ({
  countryCode,
  phoneNumber,
  handleChange,
  name,
  //   handleCountryCodeChange,
  label,
  error,
  handdleBlur,
  size = undefined
}) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      gap={1}
      textAlign={"left"}
      // marginLeft={-1}
    >
      <InputLabel sx={{marginLeft: 1}} htmlFor="phoneNumber">{label}</InputLabel>
      <TextField
        // sx={{width: "100%"}}
        id="phoneNumber"
        variant="outlined"
        onChange={handleChange}
        name="phoneNumber"
        value={phoneNumber}
        size={size}
        error={!!error}
        helperText={error}
        onBlur={() => handdleBlur?.(name)}
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
                  <MenuItem value="+234">+234</MenuItem>
                  {/* <MenuItem value="+91">+91</MenuItem>
                  <MenuItem value="+44">+44</MenuItem> */}
                </Select>
              </FormControl>
            </InputAdornment>
          ),
        }}
        sx={{ flex: 1 }}
      />
    </Box>
  );
};

export default PhoneNumberField;
