import React, { useState } from "react";
import {
  Grid,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Manually from "./Manually";
import Generated from "./Generated";

interface mintData {
  nftData: any;
}

interface ViewItem {
  id: number;
  title: string;
  state: string;
}

const view: ViewItem[] = [
  {
    id: 0.1,
    title: "AI Generated",
    state: "ai",
  },
  {
    id: 0.2,
    title: "Upload Manually",
    state: "manual",
  },
];
const MintContainer: React.FC<mintData> = ({ nftData }) => {
  const [instruction, setInstruction] = React.useState<string | null>("ai");
  const toggleTitle = {
    fontSize: "15px",
    fontWeight: 400,
    lineHeight: "normal",
    textTransform: "none  !important",
  };
  const handleInstruction = (
    event: React.MouseEvent<HTMLElement>,
    newInstruction: string | null
  ) => {
    setInstruction(newInstruction);
  };
  return (
    <Box>
      <Box className="items-center flex flex-col justify-center">
        <ToggleButtonGroup
          value={instruction}
          exclusive
          onChange={handleInstruction}
          aria-label="Platform"
          sx={{
            borderRadius: "100px",
            background: "rgba(91, 75, 255, 1)",
          }}
        >
          {view.map((item) => (
            <ToggleButton
              key={item.id}
              value={item.state}
              sx={{ borderRadius: "100px", padding: 0, border: "none" }}
            >
              <Box
                borderRadius="100px"
                bgcolor={
                  instruction === item.state
                    ? "rgba(128, 116, 255, 1)"
                    : "transparent"
                }
                paddingY={0.5}
                paddingX={5}
              >
                <Typography
                  sx={toggleTitle}
                  color={instruction === item.state ? "white" : "#ADADAD"}
                >
                  {item.title}
                </Typography>
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Box mt={3} width="100%">
          {instruction === "manual" ? <Manually /> : <Generated />}
        </Box>
      </Box>
    </Box>
  );
};

export default MintContainer;
