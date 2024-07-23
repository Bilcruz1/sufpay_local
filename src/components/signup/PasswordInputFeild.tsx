import { Box, InputLabel, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface IProps {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  error? : string
}

const PasswordInputFeild: React.FC<IProps> = ({
  name,
  value,
  handleChange,
  label,
  error
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={1.3}>
      <InputLabel
        htmlFor={name}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography component={"span"}>{label}</Typography>
        {!showPassword && (
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={0.5}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <VisibilityIcon />
            <Typography component={"span"}>Show</Typography>
          </Box>
        )}

        {showPassword && (
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={0.5}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <VisibilityOffIcon />
            <Typography component={"span"}>Hide</Typography>
          </Box>
        )}
      </InputLabel>
      <TextField
        id={name}
        variant="outlined"
        onChange={handleChange}
        name={name}
        value={value}
        type={showPassword ? "text" : "password"}
        onPaste={handlePaste}
        onBlur={() => setShowPassword(false)}
        error={!!error}
        helperText={error}
      />
    </Box>
  );
};

export default PasswordInputFeild;
