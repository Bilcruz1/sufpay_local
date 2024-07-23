import { Footer, ContactUs, WhatWeDo, Header, AboutUs, CoreValues, OurServices } from "../components";



const LandingPage = () => {
  return (
    <>
      <Header id="home" />
      <AboutUs id="about" />
      <CoreValues />
      <WhatWeDo />
      <OurServices id="services" />
      <ContactUs id="contact" />
      <Footer />
    </>
  );
};

export default LandingPage;
