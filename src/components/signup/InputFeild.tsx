import { Box, InputLabel, TextField, Typography } from "@mui/material";

interface IProps {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
}
const InputFeild: React.FC<IProps> = ({
  name,
  value,
  handleChange,
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
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <TextField
        id={name}
        variant="outlined"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        name={name}
        value={value}
        error={!!error}
        helperText={error}
      />
    </Box>
  );
};

export default InputFeild;
