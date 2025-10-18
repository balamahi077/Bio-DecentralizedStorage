# 🌐 Bio-DecentralizedStorage

A modern, decentralized file storage application that combines blockchain technology with IPFS for secure, permanent file storage. Users can connect their MetaMask wallet, upload files to IPFS via Pinata, and record file metadata on-chain using a smart contract.

## ✨ Features

- 🔐 **MetaMask Integration** - Secure wallet connection
- 📁 **IPFS Storage** - Decentralized file storage via Pinata
- ⛓️ **Blockchain Registry** - On-chain file metadata storage
- 🎨 **Modern UI** - Beautiful, responsive design with custom CSS
- 🌙 **Dark Mode** - Automatic dark mode support
- 📱 **Responsive** - Works seamlessly on all devices
- 🗑️ **File Management** - Upload, view, and delete files

## 🛠️ Tech Stack

### Smart Contracts
- **Hardhat v2** - Development environment
- **Solidity 0.8.24** - Smart contract language
- **Ethers v6** - Ethereum library
- **TypeScript** - Type-safe development

### Frontend
- **Vite** - Fast build tool
- **TypeScript** - Type safety
- **Custom CSS** - Clean, maintainable styling
- **Ethers.js** - Web3 integration

### Storage
- **IPFS** - Decentralized storage protocol
- **Pinata** - IPFS pinning service

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (LTS version recommended)
- **MetaMask** browser extension
- **Sepolia Test ETH** (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- **Pinata Account** with JWT token ([Sign up here](https://pinata.cloud/))

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/balamahi077/Bio-DecentralizedStorage.git
cd Bio-DecentralizedStorage
```

### 2️⃣ Smart Contract Setup

#### Install Dependencies
```bash
cd contracts
npm install
```

#### Configure Environment
Create a `.env` file in the `contracts` directory:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

#### Build and Test
```bash
npm run build
npm test
```

#### Deploy to Sepolia
```bash
npm run deploy:sepolia
```

**Important:** Copy the deployed contract address and update `web/src/contract.ts`:

```typescript
export const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS'
```

### 3️⃣ Frontend Setup

#### Install Dependencies
```bash
cd ../web
npm install
```

#### Configure Pinata JWT

For development, you need to expose your Pinata JWT token. **Note: This is for development only!**

**Option 1: Browser Console (Quick Test)**
```javascript
window.PINATA_JWT = 'YOUR_PINATA_JWT_TOKEN'
```

**Option 2: Environment Variable (Recommended)**
Create a `.env` file in the `web` directory:
```env
VITE_PINATA_JWT=YOUR_PINATA_JWT_TOKEN
```

Then update `web/src/main.ts` to use:
```typescript
const jwt = import.meta.env.VITE_PINATA_JWT || (window as any).PINATA_JWT || ''
```

#### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

#### Build for Production
```bash
npm run build
npm run preview
```

## 📖 How to Use

### Step 1: Connect Wallet
1. Open the application in your browser
2. Click the **"Get Started"** button on the landing page
3. Click **"Connect Wallet"** and approve the MetaMask connection

### Step 2: Upload Files
1. Click **"Choose File"** and select a file from your computer
2. (Optional) Enter a custom name for your file
3. Click **"Upload to IPFS & Record"**
4. Confirm the transaction in MetaMask
5. Wait for the upload to complete

### Step 3: View Your Files
- Your uploaded files will appear in the **"Your Files"** section
- Click on any file name to view it via the IPFS gateway
- Each file shows the upload timestamp

### Step 4: Delete Files
- Click the **Delete** button next to any file
- Confirm the transaction in MetaMask
- The file metadata will be removed from the blockchain

## 📁 Project Structure

```
Bio-DecentralizedStorage/
├── contracts/              # Smart contracts
│   ├── contracts/         # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   ├── test/              # Contract tests
│   └── hardhat.config.ts  # Hardhat configuration
│
├── web/                   # Frontend application
│   ├── src/
│   │   ├── main.ts       # Main application logic
│   │   ├── style.css     # Custom CSS styles
│   │   ├── wallet.ts     # Wallet connection logic
│   │   ├── pinata.ts     # IPFS upload logic
│   │   └── contract.ts   # Contract configuration
│   ├── index.html        # HTML entry point
│   ├── vite.config.ts    # Vite configuration
│   └── package.json      # Frontend dependencies
│
└── README.md             # This file
```

## 🎨 Design Features

- **Landing Page** - Beautiful hero section with gradient effects
- **App Page** - Clean, card-based layout with sections for:
  - Wallet connection
  - File upload form
  - File list with icons and timestamps
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Mode** - Automatic theme switching based on system preferences
- **Custom CSS** - No inline styles, all styling in `style.css`

## 🔒 Security Notes

### ⚠️ Important for Production

1. **Never expose private keys** in your code or repository
2. **Never commit `.env` files** to version control
3. **Use a backend service** to handle Pinata uploads in production
4. **Implement proper authentication** for file operations
5. **Add rate limiting** to prevent abuse
6. **Validate file types and sizes** before upload

### Recommended Production Setup

Create a serverless function (e.g., Vercel, Netlify, AWS Lambda) to:
- Handle Pinata JWT securely
- Validate uploads
- Sign transactions server-side

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npm test
```

### Test Coverage
```bash
npm run coverage
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **IPFS** - Decentralized storage protocol
- **Pinata** - IPFS pinning service
- **Hardhat** - Ethereum development environment
- **Vite** - Next generation frontend tooling
- **MetaMask** - Crypto wallet for Web3

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ by [balamahi077](https://github.com/balamahi077)**
