# MetaMask Integrated Decentralized Cloud Storage

This project lets users connect MetaMask, upload files to IPFS via Pinata, and record a pointer (CID + name + timestamp) on-chain using a simple `FileRegistry` smart contract.

## Stack
- Contracts: Hardhat v2 (TypeScript), Solidity 0.8.24, Ethers v6
- Frontend: Vite + TypeScript + Tailwind
- Storage: IPFS via Pinata (JWT)

## Prerequisites
- Node.js LTS
- MetaMask
- Sepolia test ETH (from a faucet)
- Pinata account (JWT token)

## Setup

### Contracts
```
cd contracts
npm i
npm run build
npm test
```

Optional: create `.env` with
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_KEY
```

Deploy to Sepolia:
```
npm run deploy:sepolia
```
Copy the deployed address into `web/src/contract.ts` as `CONTRACT_ADDRESS`.

### Frontend
```
cd web
npm i
# For dev, expose Pinata JWT as a global (development only):
# Windows PowerShell example:
# $env:PINATA=\"Bearer ey...\"; (echo "window.PINATA_JWT='$env:PINATA'" > public/pinata.js)
# And include <script src="/pinata.js"></script> in index.html if desired.

npm run dev
```

Or build:
```
npm run build
npm run preview
```

### Using the App
1. Connect wallet in the UI.
2. Choose a file and click Upload.
3. The file is pinned to IPFS (Pinata) and the CID is recorded on-chain.
4. Your files list will render links via `ipfs.io` gateway.

## Notes
- For production, never expose secrets in the browser. Use a small serverless function to sign Pinata uploads.
- Tailwind is pre-configured; adjust UI in `web/src/main.ts` as needed.
