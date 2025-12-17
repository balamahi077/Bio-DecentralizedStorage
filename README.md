# 🌐 Bio-DecentralizedStorage

A modern, decentralized file storage application that combines blockchain technology with IPFS for secure, permanent file storage. Now featuring **cutting-edge face recognition authentication** powered by Raspberry Pi for enhanced security!

## ✨ Features

### 🔐 Face Recognition Authentication (NEW!)
- **Biometric Login** - Login using facial recognition instead of passwords
- **Multi-Angle Registration** - Capture face from 3 angles for accuracy
- **Raspberry Pi Powered** - Local face processing for privacy
- **JWT Sessions** - Secure token-based authentication
- **Protected Access** - App accessible only after face verification

### 📁 Decentralized Storage
- **MetaMask Integration** - Secure wallet connection
- **IPFS Storage** - Decentralized file storage via Pinata
- **Blockchain Registry** - On-chain file metadata storage
- **File Management** - Upload, view, and delete files

### 🎨 User Experience
- **Modern UI** - Beautiful, responsive design with custom CSS
- **Dark Mode** - Automatic dark mode support
- **Responsive** - Works seamlessly on all devices
- **Real-time Feedback** - Status updates during authentication

## 🛠️ Tech Stack

### Authentication (NEW!)
- **Node.js + Express** - Backend API server
- **MongoDB** - User database
- **JWT** - Token-based authentication
- **Raspberry Pi** - Face recognition hardware
- **Python + Flask** - Face recognition server
- **OpenCV** - Computer vision
- **face_recognition** - Face detection & encoding
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

### For Face Recognition Authentication:
- **Node.js** (v18+ recommended)
- **MongoDB** (Community Edition)
- **Raspberry Pi** (3B+ or newer) with Camera Module
- **Python 3.7+** (on Raspberry Pi)

### For Decentralized Storage:
- **MetaMask** browser extension
- **Sepolia Test ETH** (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- **Pinata Account** with JWT token ([Sign up here](https://pinata.cloud/))

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/balamahi077/Bio-DecentralizedStorage.git
cd Bio-DecentralizedStorage
```

### 2️⃣ Face Recognition Setup (NEW!)

> **Quick Setup:** Run `setup-all.bat` (Windows) to automatically install all dependencies!

#### Backend API Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

#### Raspberry Pi Setup
```bash
# Transfer files to your Raspberry Pi
scp -r raspberry-pi/* pi@raspberrypi.local:/home/pi/face-recognition/

# SSH into Raspberry Pi
ssh pi@raspberrypi.local

# Run setup script
cd face-recognition
chmod +x setup.sh
./setup.sh
```

#### Start Services
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Raspberry Pi Server (on Pi)
python3 face_server.py
```

📚 **Detailed Guide:** See [FACE_RECOGNITION_SETUP.md](./FACE_RECOGNITION_SETUP.md) for complete instructions!

### 3️⃣ Smart Contract Setup

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

### Step 1: Register with Face Recognition (NEW!)
1. Open the application: `http://localhost:5173`
2. Click **"Register New Account"**
3. Enter your username and email
4. Click **"Next: Capture Face"**
5. Capture your face from 3 angles:
   - **Angle 1:** Look straight at the camera
   - **Angle 2:** Turn your head slightly left
   - **Angle 3:** Turn your head slightly right
6. Click **"Complete Registration"**

### Step 2: Login with Face
1. Click **"Login with Face"**
2. Enter your username
3. Click **"Verify Face & Login"**
4. Look at the camera for verification
5. ✅ You're logged in! Your username appears in the top-right corner

### Step 3: Access the App
1. Click **"Get Started"** on the landing page
2. You'll be taken to the IPFS storage app

### Step 4: Connect Wallet
1. Click **"Connect Wallet"** and approve the MetaMask connection

### Step 5: Upload Files
1. Click **"Choose File"** and select a file from your computer
2. (Optional) Enter a custom name for your file
3. Click **"Upload to IPFS & Record"**
4. Confirm the transaction in MetaMask
5. Wait for the upload to complete

### Step 6: View Your Files
- Your uploaded files will appear in the **"Your Files"** section
- Click on any file name to view it via the IPFS gateway
- Each file shows the upload timestamp

### Step 7: Delete Files
- Click the **Delete** button next to any file
- Confirm the transaction in MetaMask
- The file metadata will be removed from the blockchain

## 📁 Project Structure

```
Bio-DecentralizedStorage/
├── backend/                    # ✨ NEW - Backend API Server
│   ├── src/
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── config/            # Configuration
│   │   └── server.ts          # Express server
│   └── package.json           # Backend dependencies
│
├── raspberry-pi/               # ✨ NEW - Face Recognition Server
│   ├── face_server.py         # Flask server
│   ├── requirements.txt       # Python dependencies
│   ├── setup.sh               # Auto-setup script
│   └── README.md              # Pi setup guide
│
├── contracts/                  # Smart contracts
│   ├── contracts/             # Solidity contracts
│   ├── scripts/               # Deployment scripts
│   ├── test/                  # Contract tests
│   └── hardhat.config.ts      # Hardhat configuration
│
├── web/                        # Frontend application
│   ├── src/
│   │   ├── pages/             # ✨ NEW - Auth pages
│   │   ├── main.ts            # Main application logic
│   │   ├── auth.ts            # ✨ NEW - Auth service
│   │   ├── auth-styles.css    # ✨ NEW - Auth styles
│   │   ├── style.css          # Custom CSS styles
│   │   ├── wallet.ts          # Wallet connection logic
│   │   ├── pinata.ts          # IPFS upload logic
│   │   └── contract.ts        # Contract configuration
│   ├── index.html             # HTML entry point
│   ├── vite.config.ts         # Vite configuration
│   └── package.json           # Frontend dependencies
│
├── FACE_RECOGNITION_SETUP.md  # ✨ NEW - Setup guide
├── AUTHENTICATION_FEATURES.md # ✨ NEW - Features doc
├── SYSTEM_ARCHITECTURE.md     # ✨ NEW - Architecture
├── IMPLEMENTATION_SUMMARY.md  # ✨ NEW - Summary
├── QUICK_START.md             # ✨ NEW - Quick guide
└── README.md                  # This file
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

### Face Recognition Security (NEW!)

1. **Change JWT Secret** - Use a long, random secure string
2. **Secure MongoDB** - Enable authentication and use strong passwords
3. **Protect Raspberry Pi** - Change default password, use SSH keys
4. **HTTPS Only** - Use SSL certificates in production
5. **Local Processing** - Face data never leaves your network
### Recommended Production Setup

Create a serverless function (e.g., Vercel, Netlify, AWS Lambda) to:
- Handle Pinata JWT securely
- Validate uploads
- Sign transactions server-side

## 📚 Documentation

### Face Recognition Guides
- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[FACE_RECOGNITION_SETUP.md](./FACE_RECOGNITION_SETUP.md)** - Complete setup guide
- **[AUTHENTICATION_FEATURES.md](./AUTHENTICATION_FEATURES.md)** - Feature documentation
- **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)** - System architecture
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation details
- **[raspberry-pi/README.md](./raspberry-pi/README.md)** - Raspberry Pi guide

### Deployment Guides
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to various platforms
- **[MOBILE_APP_PLAN.md](./MOBILE_APP_PLAN.md)** - Mobile app development plan
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

