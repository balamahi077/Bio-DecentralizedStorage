// Fill these after deploying the contract
export const CONTRACT_ADDRESS = "0x05864fBD433c5e3eA1a005D51a8aF0fab0386778"; // Deployed to Sepolia
export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "cid", type: "string" },
      { internalType: "string", name: "name", type: "string" }
    ],
    name: "addFile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getMyFiles",
    outputs: [
      {
        components: [
          { internalType: "string", name: "cid", type: "string" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" }
        ],
        internalType: "struct FileRegistry.FileRecord[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "string", name: "cid", type: "string" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "FileAdded",
    type: "event"
  }
] as const;
