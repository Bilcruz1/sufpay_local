import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React from "react";

const NewsletterContainer = styled(Box)({
  backgroundColor: "#f5f5f5",
  padding: "2rem 0",
  textAlign: "center",
});

const Newsletter = () => {
  return (
    <Box
      sx={{
        height: "50vh",
        backgroundColor: "#f5f5f5",
        display: "grid",
        placeItems: "center",
      }}
    >
      <NewsletterContainer>
        <Container>
          <Typography variant="h4" gutterBottom>
            Newsletter
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ca
            quis aliquam arcu lacus.
          </Typography>

                  <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                        gap: '1rem',
          }}>
            <TextField
              variant="outlined"
              placeholder="Your email"
              sx={{ width: "300px", mt: 2, mb: 4 }}
            />
            <Button variant="contained" color="primary" size="large">
              Subscribe
            </Button>
          </Box>
        </Container>
      </NewsletterContainer>
    </Box>
  );
};

export default Newsletter;
