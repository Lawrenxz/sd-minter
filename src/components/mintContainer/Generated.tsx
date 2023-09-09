"use client";

import { Box, Grid, Typography, Button, TextField } from "@mui/material";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useFormik, ErrorMessage } from "formik";
import { Input as inp, Tooltip } from "antd";
import { AiFillQuestionCircle } from "react-icons/ai";
import { validationSchema } from "validation/nftValidation";
import { toMetaplexFile } from "@metaplex-foundation/js";
import { useMetaplex } from "metaplexInstance";
import * as Web3 from "@solana/web3.js";
import toast from "react-hot-toast";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { idlPrompt, authorFilter } from "utils/idlPrompt";
import CustomLoading from "components/customLoading/CustomLoading";

const { TextArea } = inp; // Use lowercas

interface NFTInfo {
  name: string;
  description: string;
  // You can replace `any` with a more specific type if needed
}
interface PROMPTInfo {
  prompt: string;
  model: string;
  // You can replace `any` with a more specific type if needed
}
interface Attributes {
  [key: string]: string;
}

const Generated: React.FC = () => {
  const programId = new Web3.PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
  // const programId = new Web3.PublicKey(
  //   "Ha8MaCcGoSkFiE2ZCoUwQDmZZ7aZcyvDCR1whoQKNs6m"
  // );
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [lastTodo, setLastTodo] = useState<number>(0);
  const [todos, setTodos] = useState<any[]>([]); // Adjust the type accordingly
  const [transactionPending, setTransactionPending] = useState<boolean>(false);

  const { metaplex: mx } = useMetaplex();

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [realBlobUrl, setRealBlobUrl] = useState<Blob | null>(null);
  const [promptInfo, setPromptInfo] = useState<PROMPTInfo>({
    prompt: "",
    model: "Meina/Unreal_V4.1",
  });

  const [nftInfo, setNftInfo] = useState<NFTInfo>({
    name: "",
    description: "",
  });
  const [attributes, setAttributes] = useState<Attributes>({});
  const [showAddFields, setShowAddFields] = useState<boolean>(false);
  const [newAttributeName, setNewAttributeName] = useState<string>("");
  const [newAttributeValue, setNewAttributeValue] = useState<string>("");
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: nftInfo,
    validationSchema: validationSchema,
    onSubmit: () => handleUploadMintNFT(),
  });
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
      if (program && publicKey && !transactionPending && !initialized) {
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

            const promptAccounts = await program.account.promptAccount.all([
              authorFilter(publicKey.toString()),
            ]);
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

    if (!initialized) {
      findProfileAccounts();
    }
  }, [publicKey, program, transactionPending]);

  const initializeUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        setLoading(true);
        const [profilePda, profileBump] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );

        const tx = await program.methods
          .initializeUser()
          .accounts({
            userProfile: profilePda,
            authority: publicKey,
            systemProgram: Web3.SystemProgram.programId,
          })
          .rpc();
        setInitialized(true);
        toast.success("Successfully initialized user.");
      } catch (error) {
        toast.error(error.toString());
        setLoading(false);
      } finally {
        setTransactionPending(false);
        setLoading(false);
      }
    }
  };
  const addPrompts = async (content: string, image_url: string) => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [profilePda, profileBump] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );
        const [todoPda, todoBump] = findProgramAddressSync(
          [
            utf8.encode("PROMPT_STATE"),
            publicKey.toBuffer(),
            Uint8Array.from([lastTodo]),
          ],
          program.programId
        );

        if (!content) {
          setTransactionPending(false);
          return;
        }

        await program.methods
          .addPrompt(content, image_url)
          .accounts({
            userProfile: profilePda,
            promptAccount: todoPda,
            authority: publicKey,
            systemProgram: Web3.SystemProgram.programId,
          })
          .rpc();
      } catch (error) {
        alert(error.toString());
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNftInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleChangeTextArea = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setNftInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleUploadMintNFT = () => {
    if (blobUrl) {
      setButtonDisable(true);
      try {
        const formData = new FormData();
        formData.append("File", blobUrl);
        const reader = new FileReader();
        reader.readAsArrayBuffer(realBlobUrl);
        reader.onload = async () => {
          const buffer = Buffer.from(reader.result as ArrayBuffer);
          // Now you can use the 'buffer' as needed, e.g., upload it
          const fileMeta = toMetaplexFile(buffer, "image.jpg") as any;

          try {
            const { uri, metadata } = await mx.nfts().uploadMetadata({
              name: nftInfo.name,
              description: nftInfo.description,
              image: toMetaplexFile(buffer, "metaplex.png"),
              attributes: [attributes],
            });
            const { nft } = await mx.nfts().create({
              uri,
              name: nftInfo.name,
              sellerFeeBasisPoints: 500,
            });

            const addingPrompt = await addPrompts(
              promptInfo.prompt,
              metadata.image
            );

            handleCancelSubmission();

            alert("NFT minted successfully");
          } catch (e) {
            alert(e);
            setButtonDisable(false);
          }
        };
      } catch (e) {
        alert(e);
        setButtonDisable(false);
      }
      setButtonDisable(false);
    }

    setButtonDisable(false);
  };
  const handleCancelSubmission = () => {
    setAttributes({});
    setNftInfo({
      name: "",
      description: "",
    });
    setShowAddFields(false);
    setBlobUrl(null);
    setRealBlobUrl(null);
    setPromptInfo({
      prompt: "",
      model: "Meina/Unreal_V4.1",
    });
  };
  const handleAttributeChange = (key: string, value: string) => {
    setAttributes((prevAttributes) => ({
      ...prevAttributes,
      [key]: value,
    }));
  };

  const handleAddAttribute = () => {
    if (newAttributeName && newAttributeValue) {
      handleAttributeChange(newAttributeName, newAttributeValue);
      setNewAttributeName("");
      setNewAttributeValue("");
    }
  };

  const handleAddFieldsToggle = () => {
    setShowAddFields(true);
  };

  const handleDeleteAttribute = (key: string) => {
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[key];
    setAttributes(updatedAttributes);
  };

  const handleChangePrompt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setPromptInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmitGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${promptInfo.model}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
          body: JSON.stringify({ inputs: promptInfo.prompt }),
        }
      );

      setLoading(false);
      const blob = await response.blob();
      setBlobUrl(URL.createObjectURL(blob));
      setRealBlobUrl(blob);
    } catch (e) {
      alert(e.toSting());
      setLoading(false);
    }
  };

  return (
    <Box>
      <CustomLoading isLoading={loading} />
      {initialized === true ? (
        <Grid container>
          <Grid item xs={12} lg={6} p={2}>
            <Box className="flex flex-row items-center  mt-2 justify-start gap-2 w-full">
              <TextField
                fullWidth
                InputProps={{
                  style: {
                    color: "white",
                    fontSize: "15px",
                    fontWeight: "normal",
                  },
                }}
                className="textfield"
                value={promptInfo.model}
                onChange={handleChangePrompt}
                type="text"
                name="model"
                placeholder="type your model here..."
              />
              <Tooltip
                placement="topRight"
                title="By default the model is set to Meina/Unreal_V4.1. To change it, go to https://huggingface.co/models to find model that suits your taste."
              >
                <AiFillQuestionCircle color="white" size={30} />
              </Tooltip>
              {/* <button onClick={createPrompt}>sdasda</button> */}
            </Box>
            <Box className="flex flex-row items-center  mt-2 justify-start gap-2 w-full">
              <TextField
                fullWidth
                InputProps={{
                  style: {
                    color: "white",
                    fontSize: "15px",
                    fontWeight: "normal",
                  },
                }}
                className="textfield"
                value={promptInfo.prompt}
                onChange={handleChangePrompt}
                type="text"
                name="prompt"
                placeholder="type your prompt here..."
              />
              <Button
                onClick={handleSubmitGenerate}
                sx={{
                  background: "rgba(128, 116, 255, 1) !important",
                  textTransform: "none",
                  height: "100% !important",
                }}
              >
                <Typography sx={{ fontSize: "15px", color: "white" }}>
                  Generate
                </Typography>
              </Button>
            </Box>
            <Box mt={2} className={blobUrl ? "dropzone" : null}>
              {blobUrl && (
                <Image
                  src={blobUrl || ""}
                  alt="AI Generated"
                  width={400}
                  height={400}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} lg={6} p={2} border="1px solid whit">
            <form onSubmit={formik.handleSubmit}>
              <Box className="flex flex-col gap-2">
                <TextField
                  InputProps={{
                    style: {
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "normal",
                    },
                  }}
                  className="textfield"
                  placeholder="Name of NFT"
                  fullWidth
                  id="name"
                  name="name"
                  value={nftInfo.name}
                  onChange={handleChange}
                />

                <TextArea
                  className="textfield"
                  rows={4}
                  id="description"
                  name="description"
                  value={nftInfo.description}
                  onChange={handleChangeTextArea}
                  placeholder="Description of NFT"
                  maxLength={100}
                />
                <Box>
                  {showAddFields ? (
                    <Box className="flex flex-row items-center justify-start gap-2">
                      <TextField
                        InputProps={{
                          style: {
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "normal",
                          },
                        }}
                        className="textfield"
                        placeholder="Attribute Name"
                        value={newAttributeName}
                        onChange={(e) => setNewAttributeName(e.target.value)}
                      />
                      <TextField
                        InputProps={{
                          style: {
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "normal",
                          },
                        }}
                        className="textfield"
                        placeholder="Attribute Value"
                        value={newAttributeValue}
                        onChange={(e) => setNewAttributeValue(e.target.value)}
                      />
                      <Button
                        onClick={handleAddAttribute}
                        sx={{
                          background: "rgba(128, 116, 255, 1) !important",
                          textTransform: "none",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px", color: "white" }}>
                          Add Attribute
                        </Typography>
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      onClick={handleAddFieldsToggle}
                      sx={{
                        background: "rgba(128, 116, 255, 1) !important",
                        textTransform: "none",
                      }}
                    >
                      <Typography sx={{ fontSize: "12px", color: "white" }}>
                        Add Attribute
                      </Typography>
                    </Button>
                  )}

                  {Object.keys(attributes).map((key) => (
                    <Box
                      key={key}
                      className="flex flex-row items-center justify-start gap-2 mt-2"
                    >
                      <TextField
                        InputProps={{
                          readOnly: true,
                          style: {
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "normal",
                          },
                        }}
                        className="textfield"
                        value={key}
                        onChange={(e) => {
                          const updatedKey = e.target.value;
                          const value = attributes[key];
                          const updatedAttributes = { ...attributes };
                          delete updatedAttributes[key];
                          handleAttributeChange(updatedKey, value);
                        }}
                      />
                      <TextField
                        InputProps={{
                          style: {
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "normal",
                          },
                        }}
                        className="textfield"
                        value={attributes[key]}
                        onChange={(e) =>
                          handleAttributeChange(key, e.target.value)
                        }
                      />

                      <Button
                        onClick={() => handleDeleteAttribute(key)}
                        sx={{
                          background: "rgba(128, 116, 255, 1) !important",
                          textTransform: "none",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px", color: "white" }}>
                          Delete Attribute
                        </Typography>
                      </Button>
                    </Box>
                  ))}
                  <Box>
                    <h2 style={{ color: "white" }}>Attributes:</h2>
                    <pre style={{ color: "white" }}>
                      {JSON.stringify(attributes, null, 2)}
                    </pre>
                  </Box>
                </Box>
                <Box className="flex flex-row items-center justify-start gap-2 mt-2">
                  <Button
                    fullWidth
                    sx={{
                      background: "rgba(128, 116, 255, 1) !important",
                      textTransform: "none",
                    }}
                    disabled={buttonDisable}
                    onClick={handleCancelSubmission}
                  >
                    <Typography sx={{ fontSize: "15px", color: "white" }}>
                      Cancel
                    </Typography>
                  </Button>
                  <Button
                    fullWidth
                    sx={{
                      background: "rgba(128, 116, 255, 1) !important",
                      textTransform: "none",
                    }}
                    type="submit"
                    disabled={
                      buttonDisable ||
                      (nftInfo.name === "" && nftInfo.description === "")
                    }
                  >
                    <Typography sx={{ fontSize: "15px", color: "white" }}>
                      Submit
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </form>
          </Grid>
        </Grid>
      ) : (
        <Button
          onClick={initializeUser}
          // onClick={addPrompts}
          hidden={initialized}
          sx={{
            background: "rgba(128, 116, 255, 1) !important",
            textTransform: "none",
            height: "100% !important",
          }}
        >
          <Typography sx={{ fontSize: "15px", color: "white" }}>
            Initialize
          </Typography>
        </Button>
      )}
    </Box>
  );
};

export default Generated;
