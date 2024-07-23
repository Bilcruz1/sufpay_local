import { Box, Button, Container, Stack, styled, Typography } from '@mui/material'
import {useState} from 'react'
import { InputFeild, TextAreaInputFeild } from '../components'
import { z } from 'zod'
import arrow_left from "../assets/icons/arrow_left.svg" 
import EastIcon from "@mui/icons-material/East";

const ContactUsFormContainer = styled(Box)({
    textAlign: 'left',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    height: '100%'
})


const formDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});


const ContactUsForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    })

    const [errors, setErrors] = useState({
      name: "",
      email: "",
      message: "",
    });
  
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setBtnDisabled(prev => false)
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}))
    }
  
  
  const handleSubmit = () => {
     setBtnDisabled(true);
     setErrors((prev) => ({
       name: "",
       email: "",
       message: "",
     }));

     //validation
     const validationResult = formDataSchema.safeParse(formData);

     if (!validationResult.success) {
       validationResult.error.errors.forEach((el) => {
         setErrors((prev) => ({ ...prev, [el.path[0]]: el.message }));
       });
       setBtnDisabled(true);
       return;
     }  

     
  }

  return (
    <ContactUsFormContainer>
      <Container
        sx={{
          width: { xs: "80%", md: "70%" },
          marging: "auto",
        }}
      >
        {/* header */}
        <Box>
          <Typography sx={{textAlign: {xs: "center", md: "left"}}} variant="h2" gutterBottom>
            Contact {` `}
            <Typography sx={{ color: "#AAC645" }} component="span" variant="h2">
              Us
            </Typography>
          </Typography>
        </Box>

        {/* form */}
        <Stack direction={"column"} gap={2}>
          <InputFeild
            name={"name"}
            value={formData.name}
            handleChange={handleChange}
            label={"Your Name"}
            error={errors.name}
            placeholder={"Write your name"}
          />
          <InputFeild
            name={"email"}
            value={formData.email}
            handleChange={handleChange}
            label={"Your Email"}
            error={errors.email}
            placeholder={"sample@mail.com"}
          />
          <TextAreaInputFeild
            name={"message"}
            value={formData.message}
            handleChange={handleChange}
            label={"Message"}
            error={errors.message}
            placeholder={"Write here..."}
            numberOfRows={6}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "right" },
              mt: 1,
            }}
          >
            <Button
              variant="contained"
              endIcon={<EastIcon />}
              onClick={handleSubmit}
              disabled={btnDisabled}
            >
              Send
            </Button>
          </Box>
        </Stack>
      </Container>
    </ContactUsFormContainer>
  );
}

export default ContactUsForm
