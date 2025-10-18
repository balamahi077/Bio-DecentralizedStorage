import { BrowserProvider, Contract, ethers } from "ethers";

export type DappContext = {
  provider: BrowserProvider;
  signer: ethers.Signer;
  account: string;
};

export async function connectWallet(): Promise<DappContext> {
  const anyWindow = window as any;
  if (!anyWindow.ethereum) throw new Error("MetaMask not found");
  const provider = new BrowserProvider(anyWindow.ethereum);
  const accounts = await anyWindow.ethereum.request({ method: "eth_requestAccounts" });
  const signer = await provider.getSigner();
  return { provider, signer, account: accounts[0] };
}

export function getContract(signer: ethers.Signer, address: string, abi: any): Contract {
  return new Contract(address, abi, signer);
}
