"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Box, IconButton } from "@mui/material";
import useCustomWallet from "utils/useCustomWallet";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
const NavBar = () => {
  const { publicKey } = useCustomWallet();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const path = useRouter().asPath;
  return (
    <nav className=" border-b z-50 border-white flex items-center justify-start w-full py-2 px-10 bg-black absolute top-0 left-0 ">
      <IconButton className="sm:hidden" onClick={handleToggleDrawer}>
        <AiOutlineMenu color="white" />
      </IconButton>

      <Box className=" flex-row w-full hidden sm:flex justify-center items-center">
        <Link href="/" className="flex-1 text-white">
          <Image
            src="/paint.webp"
            width={50}
            height={50}
            priority
            alt="Picture of the author"
          />
        </Link>

        <Box className="flex flex-row gap-5 mr-5 justify-center items-center">
          {publicKey && (
            <>
              <Link
                href="/mint"
                className={path === "/mint" ? "text-[#f7d748]" : "text-white"}
              >
                Mint
              </Link>
              <Link
                href="/gallery"
                className={
                  path === "/gallery" ? "text-[#f7d748]" : "text-white"
                }
              >
                Gallery
              </Link>
            </>
          )}
          <WalletMultiButtonDynamic className="walletButton" />
        </Box>
      </Box>

      {/* Desktop Navigation */}

      {/* Mobile Navigation */}
      {/* <div className="sm:hidden flex relative"></div> */}
      <Box
        zIndex={9999999}
        className={`fixed top-0 left-0 z-50 h-screen p-4  overflow-y-auto transition-transform ${
          isDrawerOpen ? "" : "-translate-x-full"
        } bg-[#424240] w-80  sm:hidden`}
        tabIndex={-1}
        aria-labelledby="drawer-label"
      >
        <div>
          <Box className="flex flex-row justify-center items-center pr-1 mb-2">
            <Link href="/" className="flex-1 text-white">
              <Image
                src="/paint.webp"
                width={50}
                height={50}
                priority
                alt="Picture of the author"
              />
            </Link>
            <IconButton onClick={handleToggleDrawer}>
              <AiOutlineClose color="white" />
            </IconButton>
          </Box>

          <WalletMultiButtonDynamic className="walletButton" />
          {publicKey && (
            <Box className="flex flex-col mt-5 gap-5 mr-5">
              <Link
                href="/mint"
                className={path === "/mint" ? "text-[#f7d748]" : "text-white"}
              >
                Mint
              </Link>
              <Link
                href="/gallery"
                className={
                  path === "/gallery" ? "text-[#f7d748]" : "text-white"
                }
              >
                Gallery
              </Link>
            </Box>
          )}
        </div>
      </Box>
    </nav>
  );
};

export default NavBar;
