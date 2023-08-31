/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import utils from "utils/utils";
import useCustomWallet from "utils/useCustomWallet";
import CustomPictureHolder from "components/customPictureHolder/CustomPictureHolder";
import { header } from "constant/constant";
import Layout from "components/layout/Layout";
import CustomLoading from "components/customLoading/CustomLoading";

interface FinalNFT {
  id: string;
  name: string;
  uriData: any;
}

const index = () => {
  const [nftListed, setNftListed] = useState<FinalNFT[]>([]);
  const { findNFTsByOwner } = utils();
  const { publicKey } = useCustomWallet();
  const walletAddress: any = publicKey ? publicKey.toBase58() : "";
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    async function fetchNft() {
      try {
        setLoading(true);
        const request = await findNFTsByOwner(walletAddress);

        if (request) {
          setNftListed(request);
          setLoading(false);
        }
      } catch (error) {
        alert(error.toSting());
        setLoading(false);
      }
    }

    if (publicKey) {
      fetchNft();
    }
  }, [publicKey, walletAddress]);

  return (
    <Layout title="NFT Gallery">
      <Box
        className="pt-20 min-h-screen bg-black"
        px={{ xs: 2, md: 10, lg: 20 }}
        border="10px solid black"
      >
        <CustomLoading isLoading={loading} />
        <Typography sx={header}>NFTs Gallery</Typography>
        <CustomPictureHolder nftData={nftListed} />
      </Box>
    </Layout>
  );
};

export default index;
