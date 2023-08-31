import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { subHeader } from "constant/constant";

interface CustomPromptHolderProps {
  promptData: any;
}

const CustomPromptHolder: React.FC<CustomPromptHolderProps> = ({
  promptData,
}) => {
  return (
    <Grid container mb={5} mt={2} gap={2}>
      {promptData.length > 0
        ? promptData.reverse().map((prompt: any, index: number) => (
            <Grid
              key={index}
              item
              xs={12}
              p={2}
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
                justifyContent: "flex-start",
                alignItems: "flex-start",
                overflow: "hidden",
                border: "1px solid white",
              }}
            >
              <Box
                component="img"
                src={prompt?.account?.imageUrl}
                alt="NFTr"
                sx={{
                  aspectRatio: "1/1 !important",
                  objectFit: "contain",
                  height: "100%",
                }}
              />
              <Box ml={2}>
                <Typography sx={subHeader}>
                  {prompt?.account?.content}
                </Typography>
              </Box>
            </Grid>
          ))
        : null}
    </Grid>
  );
};

export default CustomPromptHolder;
