import React from "react";
import { Grid, Box } from "@mui/material";

interface CustomPictureHolderProps {
  nftData: any;
}

const CustomPictureHolder: React.FC<CustomPictureHolderProps> = ({
  nftData,
}) => {
  return (
    <Grid container mb={5}>
      {nftData.length > 0
        ? nftData.map((nft: any) => (
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
                src={nft?.uriData?.image}
                alt="Member"
                sx={{
                  aspectRatio: "1/1 !important",
                  objectFit: "contain",
                  height: "100%",
                }}
              />
            </Grid>
          ))
        : null}
    </Grid>
  );
};

export default CustomPictureHolder;
