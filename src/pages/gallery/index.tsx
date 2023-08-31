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

  useEffect(() => {
    async function fetchNft() {
      try {
        const request = await findNFTsByOwner(walletAddress);

        if (request) {
          setNftListed(request);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
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
        {nftListed?.length === 0 ? (
          <CustomLoading isLoading={true} />
        ) : (
          <>
            <Typography sx={header}>NFTs Gallery</Typography>
            <CustomPictureHolder nftData={nftListed} />
          </>
        )}
      </Box>
    </Layout>
  );
};

export default index;
