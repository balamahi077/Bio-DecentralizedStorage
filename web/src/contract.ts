// Fill these after deploying the contract
export const CONTRACT_ADDRESS = "0x22B3272eDAB62d7272bB103f1CCE7F86978ea436"; // Deployed to Sepolia
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
    inputs: [
      { internalType: "uint256", name: "index", type: "uint256" }
    ],
    name: "removeFile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
