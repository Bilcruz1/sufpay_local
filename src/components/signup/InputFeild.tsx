import { Box, InputLabel, TextField, Typography } from "@mui/material";

interface IProps {
  name: string;
  value: string;
  handleChange: (value: string) => void;
  label: string;
}
const InputFeild: React.FC<IProps> = ({ name, value, handleChange, label }) => {
  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={1} textAlign={'left'}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <TextField
        id={name}
        variant="outlined"
        onChange={(e) => handleChange}
        name={name}
        value={value}
      />
    </Box>
  );
};

export default InputFeild;
