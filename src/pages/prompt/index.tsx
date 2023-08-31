/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState, useMemo } from "react";
import Layout from "components/layout/Layout";
import { Box, Grid, Typography } from "@mui/material";
import utils from "utils/utils";
import useCustomWallet from "utils/useCustomWallet";
import { header } from "constant/constant";
import MintContainer from "components/mintContainer/MintContainer";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as Web3 from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { idlPrompt } from "utils/idlPrompt";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import CustomPromptHolder from "components/customPromptHolder/CustomPromptHolder";
import CustomLoading from "components/customLoading/CustomLoading";

const index = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const programId = new Web3.PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [lastTodo, setLastTodo] = useState<number>(0);
  const [todos, setTodos] = useState<any[]>([]); // Adjust the type accordingly
  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(idlPrompt as any, programId, provider);
    }
  }, [connection, anchorWallet]);
  useEffect(() => {
    const findProfileAccounts = async () => {
      if (program && publicKey) {
        try {
          setLoading(true);
          const [profilePda, profileBump] = await findProgramAddressSync(
            [utf8.encode("USER_STATE"), publicKey.toBuffer()],
            program.programId
          );

          const profileAccount: any | null =
            await program.account.userProfile.fetch(profilePda);

          if (profileAccount) {
            setInitialized(true);
            setLastTodo(profileAccount.lastPrompt);

            const promptAccounts = await program.account.promptAccount.all();

            setTodos(promptAccounts);
          } else {
            setInitialized(false);
          }
        } catch (error) {
          // alert(error);
          setTodos([]);
        } finally {
          setLoading(false);
        }
      }
    };

    findProfileAccounts();
  }, [publicKey, program]);

  return (
    <Layout title="Mint NFT">
      <Box
        className="pt-20 min-h-screen bg-black"
        px={{ xs: 2, md: 10, lg: 20 }}
        border="10px solid black"
      >
        <CustomLoading isLoading={loading} />
        <Typography sx={header}>Generated Prompt</Typography>
        <CustomPromptHolder promptData={todos} />
      </Box>
    </Layout>
  );
};

export default index;
