import { Box, InputLabel, TextField } from "@mui/material";

interface IProps {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
  placeholder?: string;
  handdleBlur?: (e: string) => void;
  size?: "small" | "medium" | undefined;
}
const InputFeild: React.FC<IProps> = ({
  name,
  value,
  handleChange,
  label,
  error,
  placeholder,
  handdleBlur,
  size = undefined,
}) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      gap={1.3}
      textAlign={"left"}
    >
      <InputLabel sx={{ marginLeft: 1 }} htmlFor={name}>
        {label}
      </InputLabel>
      <TextField
        id={name}
        variant="outlined"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        name={name}
        value={value}
        error={!!error}
        helperText={error}
        placeholder={placeholder}
        onBlur={() => handdleBlur?.(name)}
        size={size}
      />
    </Box>
  );
};

export default InputFeild;




