import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { subHeaderTitle } from "constant/constant";

interface CustomPictureHolderProps {
  nftData: any;
}

const CustomPictureHolder: React.FC<CustomPictureHolderProps> = ({
  nftData,
}) => {
  const router = useRouter();
  return (
    <Grid container mb={5} mt={2} rowSpacing={2} columnSpacing={2}>
      {nftData.length > 0 ? (
        nftData.map((nft: any) => (
          <Grid
            key={nft?.id}
            item
            xs={6}
            md={4}
            lg={3}
            position="relative"
            height={{
              xs: 155,
              sm: 250,
              md: 220,
              lg: 280,
              xl: 280,
            }}
            maxHeight={{
              xs: 155,
              sm: 250,
              md: 220,
              lg: 280,
              xl: 280,
            }}
            sx={{
              backgroundColor: "transparent",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              onClick={() => router.push(`/gallery/nft/${nft.id}`)}
              src={nft?.uriData?.image}
              alt="NFT"
              sx={{
                aspectRatio: "1/1 !important",
                objectFit: "contain",
                height: "100%",
                "&:hover": {
                  cursor: "pointer",
                  opacity: 0.8,
                },
              }}
            />
          </Grid>
        ))
      ) : (
        <Typography sx={subHeaderTitle}>No data found</Typography>
      )}
    </Grid>
  );
};

export default CustomPictureHolder;
