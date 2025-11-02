import { registerUser, captureFace, getCameraPreview, checkCameraHealth, getCameraStreamUrl } from '../auth'

let currentUserId = ''
let currentAngle = 1
let previewInterval: number | null = null
let isPreviewActive = false

export function renderRegisterPage(onComplete: () => void, onBack: () => void) {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <button id="back-btn" class="back-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </button>
          <h1>Register New Account</h1>
        </div>
        
        <!-- Step 1: User Info -->
        <div id="step-1" class="auth-step">
          <div class="step-indicator">
            <div class="step-number active">1</div>
            <div class="step-label">Basic Information</div>
          </div>
          
          <div class="form-group">
            <label>Username</label>
            <input id="username" type="text" placeholder="Choose a username" class="text-input" />
            <small>3-30 characters, will be used for login</small>
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input id="email" type="email" placeholder="your.email@example.com" class="text-input" />
          </div>
          
          <button id="next-step" class="primary-btn">
            Next: Capture Face
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
        </div>
        
        <!-- Step 2: Face Capture -->
        <div id="step-2" class="auth-step hidden">
          <div class="step-indicator">
            <div class="step-number active">2</div>
            <div class="step-label">Face Registration</div>
          </div>
          
          <div class="face-capture-info">
            <div class="info-icon">📸</div>
            <p>We'll capture your face from 3 different angles for better accuracy and security.</p>
            <p class="info-note">Make sure you're in a well-lit area and position your face clearly in front of the camera.</p>
          </div>
          
          <div class="camera-preview">
            <div id="camera-placeholder" class="camera-icon-large">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <img id="camera-feed" class="camera-feed hidden" alt="Camera feed" />
            <div id="camera-status" class="camera-status">Connecting to camera...</div>
            <button id="start-preview" class="secondary-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Start Camera Preview
            </button>
          </div>
          
          <div id="capture-progress" class="capture-progress">
            <div class="progress-item" id="angle-1">
              <div class="progress-icon">📸</div>
              <div class="progress-text">
                <strong>Angle 1: Front Face</strong>
                <span>Look straight at the camera</span>
              </div>
              <div class="progress-status pending">Pending</div>
            </div>
            
            <div class="progress-item" id="angle-2">
              <div class="progress-icon">📸</div>
              <div class="progress-text">
                <strong>Angle 2: Left Turn</strong>
                <span>Turn your head slightly left</span>
              </div>
              <div class="progress-status pending">Pending</div>
            </div>
            
            <div class="progress-item" id="angle-3">
              <div class="progress-icon">📸</div>
              <div class="progress-text">
                <strong>Angle 3: Right Turn</strong>
                <span>Turn your head slightly right</span>
              </div>
              <div class="progress-status pending">Pending</div>
            </div>
          </div>
          
          <div class="button-group">
            <button id="capture-face" class="primary-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              </svg>
              Capture Face
            </button>
            
            <button id="complete-registration" class="success-btn hidden">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Complete Registration
            </button>
          </div>
        </div>
        
        <div id="status" class="status-message"></div>
      </div>
    </div>
  `
  
  setupRegisterEventListeners(onComplete, onBack)
}

function setupRegisterEventListeners(onComplete: () => void, onBack: () => void) {
  const backBtn = document.getElementById('back-btn')
  const nextStepBtn = document.getElementById('next-step') as HTMLButtonElement
  const captureFaceBtn = document.getElementById('capture-face') as HTMLButtonElement
  const completeBtn = document.getElementById('complete-registration') as HTMLButtonElement
  const startPreviewBtn = document.getElementById('start-preview') as HTMLButtonElement
  
  // Back button
  backBtn?.addEventListener('click', onBack)
  
  // Camera preview button
  startPreviewBtn?.addEventListener('click', async () => {
    if (isPreviewActive) {
      stopCameraPreview()
    } else {
      await startCameraPreview()
    }
  })
  
  // Step 1: Create user account
  nextStepBtn?.addEventListener('click', async () => {
    const username = (document.getElementById('username') as HTMLInputElement).value.trim()
    const email = (document.getElementById('email') as HTMLInputElement).value.trim()
    
    if (!username || !email) {
      showStatus('Please fill in all fields', 'error')
      return
    }
    
    if (username.length < 3 || username.length > 30) {
      showStatus('Username must be 3-30 characters', 'error')
      return
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showStatus('Please enter a valid email', 'error')
      return
    }
    
    try {
      showStatus('Creating account...', 'info')
      nextStepBtn.disabled = true
      
      const result = await registerUser(username, email)
      currentUserId = result.userId
      
      showStatus('Account created! Now let\'s capture your face.', 'success')
      
      // Move to step 2
      setTimeout(() => {
        document.getElementById('step-1')?.classList.add('hidden')
        document.getElementById('step-2')?.classList.remove('hidden')
        currentAngle = 1
      }, 1000)
      
    } catch (error: any) {
      showStatus(error.message, 'error')
      nextStepBtn.disabled = false
    }
  })
  
  // Step 2: Capture face
  captureFaceBtn?.addEventListener('click', async () => {
    if (currentAngle > 3) {
      showStatus('All angles captured!', 'success')
      return
    }
    
    try {
      showStatus(`Capturing angle ${currentAngle}... Please look at the camera!`, 'info')
      captureFaceBtn.disabled = true
      
      const result = await captureFace(currentUserId, currentAngle)
      
      // Update progress
      const angleElement = document.getElementById(`angle-${currentAngle}`)
      const statusElement = angleElement?.querySelector('.progress-status')
      if (statusElement) {
        statusElement.textContent = '✓ Captured'
        statusElement.className = 'progress-status completed'
      }
      angleElement?.classList.add('completed')
      
      showStatus(result.message, 'success')
      
      currentAngle++
      
      if (currentAngle > 3) {
        // All angles captured
        showStatus('All face angles captured successfully!', 'success')
        captureFaceBtn.classList.add('hidden')
        completeBtn.classList.remove('hidden')
      } else {
        captureFaceBtn.disabled = false
      }
      
    } catch (error: any) {
      showStatus(error.message, 'error')
      captureFaceBtn.disabled = false
    }
  })
  
  // Complete registration
  completeBtn?.addEventListener('click', () => {
    showStatus('Registration completed successfully!', 'success')
    setTimeout(() => {
      onComplete()
    }, 1000)
  })
}

function showStatus(message: string, type: 'success' | 'error' | 'info') {
  const statusDiv = document.getElementById('status')!
  statusDiv.textContent = message
  statusDiv.className = `status-message ${type}`
  
  // Auto-hide success/info messages after 3 seconds
  if (type !== 'error') {
    setTimeout(() => {
      statusDiv.textContent = ''
      statusDiv.className = 'status-message'
    }, 3000)
  }
}

// Camera preview functions
async function startCameraPreview() {
  const cameraFeed = document.getElementById('camera-feed') as HTMLImageElement
  const cameraPlaceholder = document.getElementById('camera-placeholder')!
  const cameraStatus = document.getElementById('camera-status')!
  const startPreviewBtn = document.getElementById('start-preview') as HTMLButtonElement
  
  try {
    // Check camera health first
    cameraStatus.textContent = 'Checking camera connection...'
    const healthCheck = await checkCameraHealth()
    
    if (!healthCheck.success) {
      throw new Error(healthCheck.error || 'Camera not available')
    }
    
    // Start video stream
    cameraStatus.textContent = 'Starting video feed...'
    const streamUrl = getCameraStreamUrl()
    
    cameraFeed.src = streamUrl
    cameraFeed.onload = () => {
      cameraPlaceholder.classList.add('hidden')
      cameraFeed.classList.remove('hidden')
      cameraStatus.textContent = '✅ Camera active - Position your face in the frame'
      startPreviewBtn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10l6 6-6-6z"></path>
        </svg>
        Stop Preview
      `
      isPreviewActive = true
    }
    
    cameraFeed.onerror = () => {
      throw new Error('Failed to load video stream')
    }
    
    // Start periodic frame updates for face detection feedback
    previewInterval = window.setInterval(async () => {
      try {
        const preview = await getCameraPreview()
        if (preview.success && preview.facesDetected !== undefined) {
          const faceCount = preview.facesDetected
          if (faceCount === 1) {
            cameraStatus.textContent = '✅ Face detected - Ready to capture!'
            cameraStatus.style.color = '#10b981'
          } else if (faceCount > 1) {
            cameraStatus.textContent = '⚠️ Multiple faces detected - Please ensure only one person is in frame'
            cameraStatus.style.color = '#f59e0b'
          } else {
            cameraStatus.textContent = '👤 No face detected - Position yourself in the frame'
            cameraStatus.style.color = '#6b7280'
          }
        }
      } catch (error) {
        // Silently continue if preview frame fails
      }
    }, 2000) // Check every 2 seconds
    
  } catch (error: any) {
    cameraStatus.textContent = `❌ ${error.message}`
    cameraStatus.style.color = '#ef4444'
    showStatus(error.message, 'error')
  }
}

function stopCameraPreview() {
  const cameraFeed = document.getElementById('camera-feed') as HTMLImageElement
  const cameraPlaceholder = document.getElementById('camera-placeholder')!
  const cameraStatus = document.getElementById('camera-status')!
  const startPreviewBtn = document.getElementById('start-preview') as HTMLButtonElement
  
  // Stop video stream
  cameraFeed.src = ''
  cameraFeed.classList.add('hidden')
  cameraPlaceholder.classList.remove('hidden')
  
  // Clear interval
  if (previewInterval) {
    clearInterval(previewInterval)
    previewInterval = null
  }
  
  // Reset UI
  cameraStatus.textContent = 'Camera preview stopped'
  cameraStatus.style.color = '#6b7280'
  startPreviewBtn.innerHTML = `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z"></path>
    </svg>
    Start Camera Preview
  `
  isPreviewActive = false
}
