// Fill these after deploying the contract
export const CONTRACT_ADDRESS = "0xFA57d5C9C33289DCd92AAf1C9Fa112A127e543cc"; // e.g. 0x1234...
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
  }
] as const;
