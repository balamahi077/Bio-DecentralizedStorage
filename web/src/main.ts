import './index.css'
import './style.css'
import { connectWallet, getContract } from './wallet'
import { uploadToPinata } from './pinata'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract'
import '@tailwindplus/elements'

// App state
let currentAccount = ''
let signer: any

// Render landing page
function renderLandingPage() {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="landing-page">
      <div class="landing-container">
        <div aria-hidden="true" class="gradient-blob-top">
          
        </div>
        
        <div class="hero-content">
          <div class="hero-text-center">
            <h1 class="hero-title">
              Decentralized Storage on IPFS
            </h1>
            <p class="hero-description">
              Store your files securely on IPFS with blockchain verification. Connect your MetaMask wallet and start uploading files to the decentralized web.
            </p>
            <div class="hero-buttons">
              <button id="get-started" class="get-started-btn">
                Get started
              </button>
              <a href="#features" class="learn-more-link">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  `
  
  // Attach event listener to "Get Started" button
  const getStartedBtn = document.getElementById('get-started')
  if (getStartedBtn) {
    getStartedBtn.onclick = () => {
      renderAppPage()
    }
  }
}

// Render app page
function renderAppPage() {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="app-page">
      <!-- Header -->
      <div class="app-header">
        <div class="app-header-container">
          <div class="app-logo-section">
            <div class="app-logo-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
            </div>
            <h1 class="app-title">IPFS Storage</h1>
          </div>
          <button id="back-home" class="back-home-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Wallet Connection Card -->
        <div class="wallet-card">
          <div class="wallet-card-content">
            <div class="wallet-info">
              <div class="wallet-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="wallet-text">
                <h2>Wallet Connection</h2>
                <p>Connect your MetaMask to get started</p>
              </div>
            </div>
            <div class="wallet-actions">
              <span id="account" class="account-display"></span>
              <button id="connect" class="connect-btn">Connect Wallet</button>
            </div>
          </div>
        </div>

        <!-- Upload Section -->
        <div class="upload-card">
          <div class="upload-header">
            <div class="upload-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <h2>Upload to IPFS</h2>
          </div>
          
          <div class="upload-form">
            <div class="form-group">
              <label>Select File</label>
              <input id="file" type="file" class="file-input" />
            </div>
            
            <div class="form-group">
              <label>File Name (Optional)</label>
              <input id="filename" type="text" placeholder="Enter a custom name for your file" class="text-input" />
            </div>
            
            <button id="upload" class="upload-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span>Upload to IPFS & Record</span>
            </button>
            
            <div id="status" class="status-message"></div>
          </div>
        </div>

        <!-- Files List Section -->
        <div class="files-card">
          <div class="files-header">
            <div class="files-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2>Your Files</h2>
          </div>
          <ul id="files" class="files-list"></ul>
        </div>
      </div>
    </div>
  `
  
  // Attach event listeners
  setupAppEventListeners()
}

// Setup event listeners for app page
function setupAppEventListeners() {
  const backBtn = document.getElementById('back-home')
  const connectBtn = document.getElementById('connect') as HTMLButtonElement
  const accountSpan = document.getElementById('account') as HTMLSpanElement
  const fileInput = document.getElementById('file') as HTMLInputElement
  const nameInput = document.getElementById('filename') as HTMLInputElement
  const uploadBtn = document.getElementById('upload') as HTMLButtonElement
  const statusDiv = document.getElementById('status') as HTMLDivElement
  const filesList = document.getElementById('files') as HTMLUListElement
  
  // Back to home
  if (backBtn) {
    backBtn.onclick = () => {
      renderLandingPage()
    }
  }
  
  // Connect wallet
  connectBtn.onclick = async () => {
    try {
      const ctx = await connectWallet()
      signer = ctx.signer
      currentAccount = ctx.account
      accountSpan.textContent = `Connected: ${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
      accountSpan.className = 'text-sm text-green-600 font-medium'
      await refreshFiles()
    } catch (e: any) {
      statusDiv.textContent = e.message ?? String(e)
      statusDiv.className = 'text-sm text-red-600'
    }
  }
  
  // Upload file
  uploadBtn.onclick = async () => {
    try {
      if (!signer) throw new Error('Connect wallet first')
      if (!CONTRACT_ADDRESS) throw new Error('Set CONTRACT_ADDRESS in src/contract.ts')
      const file = fileInput.files?.[0]
      
      if (!file) throw new Error('Choose a file')
      statusDiv.textContent = 'Uploading to IPFS via Pinata...'
      statusDiv.className = 'text-sm text-blue-600'

      const jwt = (window as any).PINATA_JWT || ''
      if (!jwt) throw new Error('Provide Pinata JWT in window.PINATA_JWT')
      const cid = await uploadToPinata(file, jwt)

      statusDiv.textContent = `Pinned: ${cid}. Sending transaction...`
      const contract = getContract(signer, CONTRACT_ADDRESS, CONTRACT_ABI)
      const tx = await contract.addFile(cid, nameInput.value || file.name)
      await tx.wait()
      
      statusDiv.textContent = 'File recorded on-chain successfully! ✓'
      statusDiv.className = 'text-sm text-green-600'
      await refreshFiles()
    } catch (e: any) {
      statusDiv.textContent = e.message ?? String(e)
      statusDiv.className = 'text-sm text-red-600'
    }
  }
  
  // Helper function to refresh files
  async function refreshFiles() {
    if (!signer || !CONTRACT_ADDRESS) return
    
    try {
      const contract = getContract(signer, CONTRACT_ADDRESS, CONTRACT_ABI)
      const items = await contract.getMyFiles()
      filesList.innerHTML = ''
      
      if (!items || items.length === 0) {
        const li = document.createElement('li')
        li.className = 'empty-state'
        li.innerHTML = `
          <div class="empty-state-content">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>No files found</p>
            <p>Upload some files to get started!</p>
          </div>
        `
        filesList.appendChild(li)
        return
      }
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const li = document.createElement('li')
        li.className = 'file-item'
        const url = `https://ipfs.io/ipfs/${item.cid}`
        
        const fileInfo = document.createElement('div')
        fileInfo.className = 'file-info'
        
        // File icon
        const iconWrapper = document.createElement('div')
        iconWrapper.className = 'file-icon-wrapper'
        iconWrapper.innerHTML = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        `
        
        const fileDetails = document.createElement('div')
        fileDetails.className = 'file-details'
        
        const viewLink = document.createElement('a')
        viewLink.href = url
        viewLink.target = '_blank'
        viewLink.className = 'file-link'
        viewLink.textContent = item.name || item.cid
        
        const timestamp = document.createElement('span')
        timestamp.className = 'file-timestamp'
        timestamp.innerHTML = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          ${new Date(Number(item.timestamp) * 1000).toLocaleString()}
        `
        
        fileDetails.appendChild(viewLink)
        fileDetails.appendChild(timestamp)
        
        fileInfo.appendChild(iconWrapper)
        fileInfo.appendChild(fileDetails)
        
        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'delete-btn'
        deleteBtn.innerHTML = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        `
        deleteBtn.onclick = () => deleteFile(i)
        
        li.appendChild(fileInfo)
        li.appendChild(deleteBtn)
        filesList.appendChild(li)
      }
    } catch (e: any) {
      filesList.innerHTML = ''
      const li = document.createElement('li')
      li.textContent = `Error loading files: ${e.message}`
      li.className = 'text-red-500'
      filesList.appendChild(li)
      console.error('Error refreshing files:', e)
    }
  }
  
  async function deleteFile(index: number) {
    try {
      if (!signer || !CONTRACT_ADDRESS) return
      
      const confirmed = confirm('Are you sure you want to delete this file? This action cannot be undone.')
      if (!confirmed) return
      
      statusDiv.textContent = 'Deleting file...'
      statusDiv.className = 'text-sm text-blue-600'
      const contract = getContract(signer, CONTRACT_ADDRESS, CONTRACT_ABI)
      const tx = await contract.removeFile(index)
      await tx.wait()
      
      statusDiv.textContent = 'File deleted successfully! ✓'
      statusDiv.className = 'text-sm text-green-600'
      await refreshFiles()
    } catch (e: any) {
      statusDiv.textContent = `Delete failed: ${e.message}`
      statusDiv.className = 'text-sm text-red-600'
      console.error('Delete error:', e)
    }
  }
}

// Initialize app - show landing page
renderLandingPage()