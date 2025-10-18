import './style.css'
import './index.css'
import { connectWallet, getContract } from './wallet'
import { uploadToPinata } from './pinata'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-dvh p-6 bg-gray-50 text-gray-900">
    <div class="mx-auto max-w-xl space-y-6">
      <h1 class="text-2xl font-bold">MetaMask + IPFS Storage</h1>
      <div class="flex gap-3">
        <button id="connect" class="px-4 py-2 bg-black text-white rounded">Connect Wallet</button>
        <span id="account" class="text-sm"></span>
      </div>
      <div class="space-y-3 border p-4 rounded bg-white">
        <input id="file" type="file" class="block" />
        <input id="filename" type="text" placeholder="Optional name" class="border p-2 rounded w-full" />
        <button id="upload" class="px-4 py-2 bg-blue-600 text-white rounded">Upload to IPFS + Record</button>
        <div id="status" class="text-sm"></div>
      </div>
      <div>
        <h2 class="font-semibold mb-2">Your Files</h2>
        <ul id="files" class="space-y-1"></ul>
      </div>
    </div>
  </div>
`

// App wiring
let currentAccount = ''
let signer: any

const connectBtn = document.getElementById('connect') as HTMLButtonElement
const accountSpan = document.getElementById('account') as HTMLSpanElement
const fileInput = document.getElementById('file') as HTMLInputElement
const nameInput = document.getElementById('filename') as HTMLInputElement
const uploadBtn = document.getElementById('upload') as HTMLButtonElement
const statusDiv = document.getElementById('status') as HTMLDivElement
const filesList = document.getElementById('files') as HTMLUListElement

connectBtn.onclick = async () => {
  try {
    const ctx = await connectWallet()
    signer = ctx.signer
    currentAccount = ctx.account
    accountSpan.textContent = currentAccount
    await refreshFiles()
  } catch (e: any) {
    statusDiv.textContent = e.message ?? String(e)
  }
}

async function refreshFiles() {
  if (!signer || !CONTRACT_ADDRESS) return
  const contract = getContract(signer, CONTRACT_ADDRESS, CONTRACT_ABI)
  const items = await contract.getMyFiles()
  filesList.innerHTML = ''
  for (const item of items) {
    const li = document.createElement('li')
    const url = `https://ipfs.io/ipfs/${item.cid}`
    li.innerHTML = `<a class="text-blue-600 underline" href="${url}" target="_blank">${item.name || item.cid}</a> <span class="text-xs text-gray-500">(${item.timestamp})</span>`
    filesList.appendChild(li)
  }
}

uploadBtn.onclick = async () => {
  try {
    if (!signer) throw new Error('Connect wallet first')
    if (!CONTRACT_ADDRESS) throw new Error('Set CONTRACT_ADDRESS in src/contract.ts')
    const file = fileInput.files?.[0]
    if (!file) throw new Error('Choose a file')
    statusDiv.textContent = 'Uploading to IPFS via Pinata...'

    // For dev, set PINATA_JWT in a .env and expose via a tiny proxy. For demo, paste manually:
    const jwt = (window as any).PINATA_JWT || ''
    if (!jwt) throw new Error('Provide Pinata JWT in window.PINATA_JWT')
    const cid = await uploadToPinata(file, jwt)

    statusDiv.textContent = `Pinned: ${cid}. Sending tx...`
    const contract = getContract(signer, CONTRACT_ADDRESS, CONTRACT_ABI)
    const tx = await contract.addFile(cid, nameInput.value || file.name)
    await tx.wait()
    statusDiv.textContent = 'Recorded on-chain.'
    await refreshFiles()
  } catch (e: any) {
    statusDiv.textContent = e.message ?? String(e)
  }
}
