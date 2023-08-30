"use client";

import { Box, Grid, Typography, Input, Button, TextField } from "@mui/material";
import React, { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { useFormik, FormikValues } from "formik";

import { Input as inp } from "antd";
import fs from "fs";
import { toMetaplexFile } from "@metaplex-foundation/js";

import { validationSchema } from "validation/nftValidation";
import { useMetaplex } from "metaplexInstance";
import CustomLoading from "components/customLoading/CustomLoading";

const { TextArea } = inp; // Use lowercas

interface NFTInfo {
  name: string;
  description: string;
  // You can replace `any` with a more specific type if needed
}
interface Attributes {
  [key: string]: string;
}

const Manually: React.FC = () => {
  const { metaplex: mx } = useMetaplex();
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [nftInfo, setNftInfo] = useState<NFTInfo>({
    name: "",
    description: "",
  });
  const [attributes, setAttributes] = useState<Attributes>({});
  const [showAddFields, setShowAddFields] = useState<boolean>(false);
  const [newAttributeName, setNewAttributeName] = useState<string>("");
  const [newAttributeValue, setNewAttributeValue] = useState<string>("");
  const [ButtonDisable, setButtonDisable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: nftInfo,
    validationSchema: validationSchema,
    onSubmit: () => handleUploadMintNFT(),
  });
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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadMintNFT = async () => {
    if (file) {
      setButtonDisable(true);
      try {
        const formData = new FormData();
        formData.append("File", file);
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
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
              sellerFeeBasisPoints: 200,
            });
            handleCancelSubmission();
            alert("NFT Minted Successfully");
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
    setLoading(false);
  };
  const handleCancelSubmission = () => {
    setAttributes({});
    setNftInfo({
      name: "",
      description: "",
    });
    setShowAddFields(false);
    setFile(null);
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

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} lg={6} p={2}>
          {file ? (
            <Box className="uploads flex items-center justify-center flex-col">
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                width={400}
                height={400}
              />
              <Box className="mt-2 ">
                <Button
                  onClick={() => setFile(null)}
                  sx={{
                    background: "rgba(128, 116, 255, 1) !important",
                    textTransform: "none",
                  }}
                >
                  <Typography sx={{ fontSize: "12px", color: "white" }}>
                    Cancel
                  </Typography>
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              className="dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Typography sx={{ fontSize: "12px", color: "white" }}>
                Drag and Drop File to Upload
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "white" }}>
                or
              </Typography>
              <Input
                type="file"
                inputRef={inputRef}
                onChange={handleFileInputChange}
                sx={{ display: "none" }}
              />
              <Button
                onClick={() => inputRef.current?.click()}
                sx={{
                  background: "rgba(128, 116, 255, 1) !important",
                  textTransform: "none",
                }}
              >
                <Typography sx={{ fontSize: "12px", color: "white" }}>
                  Select File
                </Typography>
              </Button>
            </Box>
          )}
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
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
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
                        inputProps: {
                          maxLength: 12,
                        },
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
                        inputProps: {
                          maxLength: 12,
                        },

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
                  onClick={handleCancelSubmission}
                  disabled={ButtonDisable}
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
                  disabled={ButtonDisable}
                  onClick={() => {
                    setLoading(true);
                    setButtonDisable(true);
                    setTimeout(() => {
                      handleUploadMintNFT();
                    }, 2000);
                  }}
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
      <CustomLoading isLoading={loading} />
    </Box>
  );
};

export default Manually;
