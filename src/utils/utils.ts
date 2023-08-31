/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import { message } from "antd";
import { PublicKey } from "@solana/web3.js";
import { useMetaplex } from "metaplexInstance";
interface FinalNFT {
  id: any;
  name: string;
  uriData: any; // You can replace 'any' with a more specific type if you know the structure of the data
}
const utils = () => {
  const { metaplex: mx } = useMetaplex();
  const [messageApi, contextHolder] = message.useMessage();
  async function findNFTsByOwner(mintAddress: PublicKey) {
    try {
      const fetchedNFTs: FinalNFT[] = [];
      const nfts = await mx.nfts().findAllByOwner({
        owner: mintAddress,
      });

      for (const nft of nfts) {
        try {
          const response = await fetch(nft.uri);
          const uriData = await response.json();
          const parts: any = nft.uri.split("/");
          const hash = parts[parts.length - 1];
          const finalNFT: FinalNFT = {
            id: hash,
            name: nft.name,
            uriData: uriData,
          };

          fetchedNFTs.push(finalNFT);
        } catch (error) {
          console.error(`Error fetching NFT data for ID $:`, error);
        }
      }

      return fetchedNFTs;
    } catch (error) {
      messageApi.error("Something went wrong. Please try again.");
    }
  }

  return {
    findNFTsByOwner,
  };
};

export default utils;
