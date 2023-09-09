import React, { ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import NavBar from "../navBar/navBar";

import { Box, Container } from "@mui/material";
import Image from "next/image";

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
      <Box className=" border-t border-white p-3 justify-center flex flex-row item-center gap-2 text-white">
        <h4>Created by Lawrenxz</h4>
        <Image
          src="/logo.svg"
          alt="Lawrence Luague"
          width={30}
          height={30}
          className="object-obtain "
        />
      </Box>
    </Box>
  );
}

export default Layout;
