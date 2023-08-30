import React, { ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import NavBar from "../navBar/navBar";
import { Box, Container } from "@mui/material";

interface LayoutProps {
  title: string;
  children: ReactNode;
}

function Layout({ title, children }: LayoutProps) {
  return (
    <Box bgcolor="black" minHeight="100vh">
      <Head>
        <title>{`SD-MINT | ${title}`}</title>
        <meta name="Welcome to Arcus SocFi" content="SocFi" />
      </Head>
      <NavBar />
      <Container
        maxWidth="xl"
        sx={{ padding: "0 !important", background: "black" }}
      >
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
