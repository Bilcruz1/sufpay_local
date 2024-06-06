import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";

const ResetPasswordForm: React.FC = () => {
  const [values, setValues] = useState<string[]>(Array(5).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    if (/^\d$/.test(value)) {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
      // Move to the next input if current input has a valid single digit
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      // Clear the input if invalid value is entered
      event.target.value = "";
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    const target = event.currentTarget as HTMLInputElement;
    if (event.key === "Backspace") {
      if (!target.value && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else {
        const newValues = [...values];
        newValues[index] = "";
        setValues(newValues);
        target.value = ""; // Clear the current input
      }
    } else if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alginItems: "center",
          gap: 1,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputsRef.current[index] = el)}
            id={`outlined-basic-${index}`}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: { textAlign: "center", width: "2ch" },
            }}
            value={values[index]}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        ))}
      </Box>

      <Button
        sx={{
          marginTop: "4rem",
          width: "100%",
          background: "#AAC645",
          borderRadius: "32px",
        }}
        variant="contained"
      >
        Verify
      </Button>
      <Typography mt={4} variant={"caption"} display={"block"}>
        I didn’t receive a code <Link>Resend</Link>
      </Typography>
    </Box>
  );
};

export default ResetPasswordForm;
