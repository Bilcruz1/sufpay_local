
import { Box, InputLabel, TextField } from '@mui/material';
import React from 'react'


interface IProps {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
  placeholder?: string;
  numberOfRows: number;
}

const TextAreaInputFeild: React.FC<IProps> = ({
    name,
    value,
    handleChange,
    label,
    error,
    placeholder,
    numberOfRows
}) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      gap={1.3}
      textAlign={"left"}
    >
      <InputLabel htmlFor={name}>{label}</InputLabel>

      <TextField
        multiline
        rows={numberOfRows}
        variant="outlined"
        fullWidth
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        name={name}
        value={value}
        error={!!error}
        helperText={error}
        placeholder={placeholder}
      />
    </Box>
  );
};

export default TextAreaInputFeild