import React from "react";
import { Box, Typography } from "@mui/material";
import { header, subHeader } from "pages/constant/constant";
import Image from "next/image";

const FirstSection = () => {
  return (
    <div className="relative  min-h-screen grid place-items-center">
      {/* <Logo style="w-52 absolute top-0 left-0 m-8" /> */}
      <Box className="z-10">
        <Typography sx={header}>Stable Diffusion Minter</Typography>
        <Typography sx={subHeader}>
          Transforming Images into Unique NFTs with Stable Diffusion Minter
        </Typography>
      </Box>
      <Image
        src="/paint.webp"
        width={500}
        height={500}
        priority
        className="absolute z-1 opacity-60"
        alt="Picture of the author"
      />
    </div>
  );
};

export default FirstSection;
