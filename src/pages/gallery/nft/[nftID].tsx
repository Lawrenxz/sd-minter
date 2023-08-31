import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Layout from "components/layout/Layout";
import { useRouter } from "next/router";
import utils from "utils/utils";
import useCustomWallet from "utils/useCustomWallet";
import { description, name, subHeaderTitle } from "constant/constant";
import CustomLoading from "components/customLoading/CustomLoading";
import _ from "lodash";

interface MyObject {
  [key: string]: any;
}

const NFTpic = () => {
  const router = useRouter();
  const { findNFTsByOwner } = utils();

  const { publicKey } = useCustomWallet();
  const walletAddress: any = publicKey ? publicKey.toBase58() : "";
  const nftID = router.query.nftID;
  const [myNft, setMyNft] = useState<MyObject>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNft() {
      try {
        const request = await findNFTsByOwner(walletAddress);

        if (request) {
          setMyNft(request.find((nft) => nft?.id === nftID));
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    }

    if (publicKey) {
      fetchNft();
    }
    setLoading(false);
  }, [publicKey, walletAddress]);

  return (
    <Layout title="NFT">
      <Box
        className="pt-20 min-h-screen bg-black"
        border="10px solid black"
        color="white"
      >
        <CustomLoading isLoading={loading} />
        {_.isUndefined(myNft) && !loading ? (
          <Typography sx={subHeaderTitle}>No data found</Typography>
        ) : (
          <Grid container mt={5}>
            <Grid
              item
              xs={12}
              md={6}
              className="flex items-center justify-center"
            >
              {myNft?.uriData?.image && (
                <Box
                  component="img"
                  src={myNft?.uriData?.image}
                  alt="NFT"
                  sx={{
                    aspectRatio: "1/1 !important",
                    objectFit: "contain",
                    height: "100%",
                  }}
                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                justifyContent: { xs: "center", md: "flex-start" },
                display: "flex",
                alignItems: { xs: "center", md: "flex-start" },
                flexDirection: "column",
              }}
              mt={3}
            >
              {myNft?.uriData?.attributes.length > 0 ? (
                <>
                  <Box>
                    <Typography sx={name}>{myNft?.name}</Typography>
                  </Box>
                  <Box mt={3}>
                    <Typography sx={subHeaderTitle}>Description</Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography sx={description}>
                      {myNft?.uriData?.description}
                    </Typography>
                  </Box>
                  <Box mt={3}>
                    <Typography sx={subHeaderTitle}>Attributes</Typography>
                  </Box>
                  <Box mt={2}>
                    {myNft?.uriData?.attributes.map(
                      (att: any, index: number) => (
                        <Box key={index}>
                          <div>
                            {Object.entries(att).map(([key, value]) => (
                              <Box key={key}>
                                <div className="flex flex-row justify-start align-center gap-2">
                                  <Typography variant="body1">
                                    {key}:{" "}
                                  </Typography>
                                  <Typography variant="body1">
                                    {String(value)}
                                  </Typography>
                                  {/* Convert value to string using String() */}
                                </div>
                              </Box>
                            ))}
                          </div>
                        </Box>
                      )
                    )}
                  </Box>
                </>
              ) : null}
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default NFTpic;
