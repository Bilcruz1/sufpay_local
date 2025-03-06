import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import logo_img from "../assets/img/logo.svg";
import { VerifyAccountForm } from "../forms";
import { Loading, SignUpLayout } from "../components";
import useTokenValidation from "../utils/hooks/useTokenValidation";
import { useParams } from "react-router-dom";

const VerifyAccountPage = () => {
  const [btnIsDisabled, setBtnIsDisabled] = React.useState<boolean>(false);
  const { handleTokenValidation } = useTokenValidation();
  const [showLodaingPage, setShowLoadingPage] = useState<boolean>(true);
  const { token } = useParams();



  React.useEffect(() => {
    handleTokenValidation(`${token}`, setShowLoadingPage);
  });

  if (showLodaingPage)
    return <Loading isLoading={btnIsDisabled} position={"absolute"} />;

  return (
    <SignUpLayout
      header={"Sign up to Sufpay"}
      component={
        !btnIsDisabled ? (
          <VerifyAccountForm
            btnIsDisabled={btnIsDisabled}
            setBtnIsDisabled={setBtnIsDisabled}
          />
        ) : (
          <Loading isLoading={btnIsDisabled} height="100%" width="100%" />
        )
      }
    />
  );
};

export default VerifyAccountPage;
