import { Box, Button, Container, Stack, styled, Typography } from '@mui/material'
import {useState} from 'react'
import { InputFeild, TextAreaInputFeild } from '../components'
import { z } from 'zod'
import EastIcon from "@mui/icons-material/East";
import { IContatctUsForm } from '../utils/interfaces'
import { sendMessage } from '../utils/fireBaseSetup'

const ContactUsFormContainer = styled(Box)({
    textAlign: 'left',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
  height: '100%',
    marginBottom: "2rem"
})


const formDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});


const ContactUsForm = () => {
  const [formData, setFormData] = useState<IContatctUsForm>({
    name: "",
    email: "",
    message: "",
  })

  const [errors, setErrors] = useState<IContatctUsForm>({
    name: "",
    email: "",
    message: "",
  });
  
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBtnDisabled(prev => false)
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  
  const handleSubmit = async () => {
    setBtnDisabled(true)
    setErrors((prev) => ({
      name: "",
      email: "",
      message: "",
    }));

    //validation
    const validationResult = formDataSchema.safeParse(formData);

    if (!validationResult.success) {
      validationResult.error.errors.forEach((el) => {
        setErrors((prev) => ({ ...prev, [el.path[0]]: el.message }))
      })
      setBtnDisabled(true);
      console.log(validationResult)
      return;
    }

    const messageStatus: boolean = await sendMessage(formData)

    if (messageStatus === true) {
      setFormData({
        name: "",
        email: "",
        message: "",
      })
      console.log("sent")
    }
    else if (messageStatus === false) {
      console.log("failed")
    }
  }





     


  return (
    <ContactUsFormContainer>
      <Container
        sx={{
          width: { xs:"90%", md: "80%" },
          margin: "auto",
        }}
      >
        {/* header */}
        <Box>
          <Typography sx={{textAlign: "left"}} variant="h2" component={"h2"} gutterBottom>
            Contact {` `}
            <Typography sx={{ color: "#AAC645" }} component="span" variant="h2">
              Us
            </Typography>
          </Typography>
        </Box>

        {/* form */}
        <Stack direction={"column"} mt={"2.5rem"} gap={"1.5rem"}>
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
              mt: "1.5rem",
            }}
          >
            <Button
              variant="contained"
              endIcon={<EastIcon />}
              onClick={handleSubmit}
              disabled={btnDisabled}
              sx={{color: "#fff"}}
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
