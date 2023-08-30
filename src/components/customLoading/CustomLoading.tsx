import React from "react";
import { Box, CircularProgress } from "@mui/material";

interface CustomLoadingProps {
  isLoading: boolean;
}

const CustomLoading: React.FC<CustomLoadingProps> = ({ isLoading }) => {
  const root: object = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999999, // Higher zIndex to ensure it's on top
  };
  const circularProgress: object = {
    color: "#FFF", // White color for the circular progress
  };

  if (!isLoading) {
    return null; // If not loading, don't render anything
  }

  return (
    <Box sx={root}>
      <CircularProgress sx={circularProgress} />
    </Box>
  );
};

export default CustomLoading;
