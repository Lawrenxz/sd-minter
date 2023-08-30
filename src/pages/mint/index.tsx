/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState } from "react";
import Layout from "components/layout/Layout";
import { Box, Grid, Typography } from "@mui/material";
import utils from "utils/utils";
import useCustomWallet from "utils/useCustomWallet";
import { header } from "constant/constant";
import MintContainer from "components/mintContainer/MintContainer";

const index = () => {
  const { publicKey } = useCustomWallet();
  const walletAddress = publicKey ? publicKey.toBase58() : "hellow";

  return (
    <Layout title="Mint NFT">
      <Box
        className="pt-20 min-h-screen bg-black"
        px={{ xs: 2, md: 10, lg: 20 }}
      >
        <Typography sx={header}>Mint NFT</Typography>
        <MintContainer nftData={walletAddress} />
      </Box>
    </Layout>
  );
};

export default index;
