export const idlPrompt = {
  version: "0.1.0",
  name: "sd_prompt",
  constants: [
    {
      name: "USER_TAG",
      type: "bytes",
      value: "[85, 83, 69, 82, 95, 83, 84, 65, 84, 69]",
    },
    {
      name: "PROMPT_TAG",
      type: "bytes",
      value: "[80, 82, 79, 77, 80, 84, 95, 83, 84, 65, 84, 69]",
    },
  ],
  instructions: [
    {
      name: "initializeUser",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "userProfile", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "addPrompt",
      accounts: [
        { name: "userProfile", isMut: true, isSigner: false },
        { name: "promptAccount", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "content", type: "string" },
        { name: "imageUrl", type: "string" },
      ],
    },
  ],
  accounts: [
    {
      name: "UserProfile",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "lastPrompt", type: "u8" },
          { name: "promptCount", type: "u8" },
        ],
      },
    },
    {
      name: "PromptAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "idx", type: "u8" },
          { name: "content", type: "string" },
          { name: "imageUrl", type: "string" },
        ],
      },
    },
  ],
};
export const authorFilter = (authorBase58PublicKey: any) => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: authorBase58PublicKey,
  },
});
