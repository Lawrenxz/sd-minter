import { useWallet } from "@solana/wallet-adapter-react";

const useCustomWallet = () => {
  const { publicKey, wallets, wallet } = useWallet();
  const walletAddress = publicKey ? publicKey.toBase58() : "";

  return {
    publicKey,
    walletAddress,
    wallets,
    wallet,
  };
};

export default useCustomWallet;
