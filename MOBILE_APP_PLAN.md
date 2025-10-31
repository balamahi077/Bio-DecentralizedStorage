# 📱 Mobile App Development Plan

This document outlines the plan to build mobile applications for Bio-DecentralizedStorage.

## 🎯 Development Roadmap

### Phase 1: Progressive Web App (PWA) ⚡
**Timeline:** 1-2 days  
**Effort:** Low  
**Impact:** High

#### What is PWA?
A Progressive Web App makes your website installable on mobile devices and work offline, without needing app store approval.

#### Features to Add:
- ✅ Web App Manifest (Already created!)
- ✅ Service Worker for offline support
- ✅ Install prompt
- ✅ Splash screen
- ✅ App icons
- ✅ Offline file caching

#### Benefits:
- Users can install from browser
- Works on iOS and Android
- No app store approval needed
- Automatic updates
- Smaller download size

#### Implementation Steps:

1. **Add PWA Plugin to Vite**
```bash
cd web
npm install -D vite-plugin-pwa
```

2. **Update `vite.config.ts`**
```typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Bio-DecentralizedStorage',
        short_name: 'BioStorage',
        description: 'Decentralized file storage on IPFS',
        theme_color: '#4f46e5',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

3. **Create App Icons**
   - Create 192x192 and 512x512 PNG icons
   - Place in `web/public/` folder

4. **Test PWA**
   - Build: `npm run build`
   - Preview: `npm run preview`
   - Open in mobile browser
   - Click "Add to Home Screen"

---

### Phase 2: React Native App 📱
**Timeline:** 2-3 weeks  
**Effort:** Medium  
**Impact:** Very High

#### What is React Native?
Build native iOS and Android apps using JavaScript/TypeScript and React.

#### Features:
- ✅ Native mobile UI
- ✅ WalletConnect integration
- ✅ Camera for QR codes
- ✅ Biometric authentication
- ✅ Push notifications
- ✅ Native file picker
- ✅ Offline storage

#### Tech Stack:
```
- React Native 0.73+
- Expo (managed workflow)
- WalletConnect v2
- React Native IPFS
- AsyncStorage
- React Navigation
- Ethers.js
```

#### Project Structure:
```
mobile/
├── src/
│   ├── screens/
│   │   ├── LandingScreen.tsx
│   │   ├── WalletScreen.tsx
│   │   ├── UploadScreen.tsx
│   │   └── FilesScreen.tsx
│   ├── components/
│   │   ├── WalletButton.tsx
│   │   ├── FileCard.tsx
│   │   └── UploadForm.tsx
│   ├── services/
│   │   ├── wallet.ts
│   │   ├── ipfs.ts
│   │   └── contract.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── App.tsx
├── app.json
└── package.json
```

#### Implementation Steps:

1. **Initialize Expo Project**
```bash
npx create-expo-app mobile --template blank-typescript
cd mobile
```

2. **Install Dependencies**
```bash
# Core dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install ethers @walletconnect/react-native-compat
npm install @walletconnect/modal-react-native
npm install react-native-get-random-values
npm install @react-native-async-storage/async-storage

# Expo specific
npx expo install expo-camera expo-file-system expo-document-picker
```

3. **Setup WalletConnect**
```typescript
// src/services/wallet.ts
import { WalletConnectModal } from '@walletconnect/modal-react-native'
import { ethers } from 'ethers'

const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'

export const walletConnectModal = new WalletConnectModal({
  projectId,
  metadata: {
    name: 'Bio-DecentralizedStorage',
    description: 'Decentralized file storage',
    url: 'https://your-app.com',
    icons: ['https://your-app.com/icon.png']
  }
})

export async function connectWallet() {
  const { uri, approval } = await walletConnectModal.connect()
  const session = await approval()
  
  const provider = new ethers.providers.Web3Provider(
    walletConnectModal.getProvider()
  )
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  
  return { signer, address }
}
```

4. **Create Screens**
```typescript
// src/screens/LandingScreen.tsx
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Decentralized Storage on IPFS
      </Text>
      <Text style={styles.description}>
        Store your files securely on IPFS with blockchain verification
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('App')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fafafa'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
})
```

5. **Run the App**
```bash
# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Scan QR code with Expo Go app for physical device
```

6. **Build for Production**
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

### Phase 3: Desktop App (Electron) 💻
**Timeline:** 1-2 weeks  
**Effort:** Low-Medium  
**Impact:** Medium

#### What is Electron?
Build desktop apps for Windows, Mac, and Linux using web technologies.

#### Features:
- ✅ Native desktop experience
- ✅ System tray integration
- ✅ Auto-updates
- ✅ File system access
- ✅ Keyboard shortcuts

#### Implementation Steps:

1. **Install Electron**
```bash
cd web
npm install -D electron electron-builder
```

2. **Create Electron Main Process**
```javascript
// electron/main.js
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)
```

3. **Update package.json**
```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "concurrently \"npm run dev\" \"electron .\"",
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.biostorage.app",
    "productName": "Bio-DecentralizedStorage",
    "files": ["dist/**/*", "electron/**/*"],
    "directories": {
      "output": "release"
    },
    "win": {
      "target": ["nsis"]
    },
    "mac": {
      "target": ["dmg"]
    },
    "linux": {
      "target": ["AppImage"]
    }
  }
}
```

4. **Build Desktop App**
```bash
npm run electron:build
```

---

## 📊 Comparison Table

| Platform | Development Time | Complexity | App Store | Native Features | Code Reuse |
|----------|-----------------|------------|-----------|-----------------|------------|
| **PWA** | 1-2 days | Low | ❌ | Limited | 95% |
| **React Native** | 2-3 weeks | Medium | ✅ | Full | 70% |
| **Electron** | 1-2 weeks | Low | ✅ | Full | 90% |

---

## 🎯 Recommended Approach

### Week 1: PWA
- ✅ Add PWA support
- ✅ Create app icons
- ✅ Test on mobile devices
- ✅ Deploy PWA version

### Week 2-4: React Native
- ✅ Setup Expo project
- ✅ Implement WalletConnect
- ✅ Build core screens
- ✅ Test on iOS/Android
- ✅ Submit to app stores

### Week 5-6: Electron (Optional)
- ✅ Setup Electron
- ✅ Build desktop version
- ✅ Test on Windows/Mac/Linux
- ✅ Publish releases

---

## 🛠️ Development Tools Needed

### For React Native:
- **Expo Account** (free) - [expo.dev](https://expo.dev)
- **WalletConnect Project ID** (free) - [cloud.walletconnect.com](https://cloud.walletconnect.com)
- **Apple Developer Account** ($99/year) - For iOS
- **Google Play Developer Account** ($25 one-time) - For Android

### For PWA:
- Nothing extra needed! ✅

### For Electron:
- **Code signing certificate** (optional, for production)

---

## 💰 Cost Breakdown

| Item | Cost | Required For |
|------|------|--------------|
| PWA Development | Free | PWA |
| Expo Account | Free | React Native |
| WalletConnect Project | Free | React Native |
| Apple Developer | $99/year | iOS App Store |
| Google Play Developer | $25 one-time | Android Play Store |
| Code Signing Cert | $100-300/year | Desktop (optional) |

**Minimum to start:** $0 (PWA)  
**Full mobile deployment:** $124

---

## 📚 Learning Resources

### PWA:
- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [PWA Builder](https://www.pwabuilder.com/)

### React Native:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [WalletConnect React Native](https://docs.walletconnect.com/2.0/reactnative/overview)

### Electron:
- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)

---

## 🚀 Next Steps

1. **Choose your path:**
   - Quick win? → Start with PWA
   - Full mobile? → Go React Native
   - Desktop? → Try Electron

2. **Let me know which you want to build first!**
   - I can help you implement PWA right now (15 minutes)
   - Or create the React Native project structure
   - Or setup Electron

3. **I can create:**
   - Complete project setup
   - All necessary files
   - Step-by-step implementation guide

**Which platform would you like to start with?** 🎯
