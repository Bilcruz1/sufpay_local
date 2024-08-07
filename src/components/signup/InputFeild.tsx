import { Box, InputLabel, TextField } from "@mui/material";

interface IProps {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
  placeholder?: string
  handdleBlur?: (e: string) => void

}
const InputFeild: React.FC<IProps> = ({
  name,
  value,
  handleChange,
  label,
  error,
  placeholder,
  handdleBlur,
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
        id={name}
        variant="outlined"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        name={name}
        value={value}
        error={!!error}
        helperText={error}
        placeholder={placeholder}
        onBlur={() => handdleBlur?.(name) }
      />
    </Box>
  );
};

export default InputFeild;




