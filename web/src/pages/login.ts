import { loginWithFace } from '../auth'

export function renderLoginPage(onSuccess: () => void, onBack: () => void, onRegister: () => void) {
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
          <h1>Login with Face Recognition</h1>
        </div>
        
        <div class="login-content">
          <div class="login-info">
            <div class="info-icon">🔐</div>
            <p>Enter your username and verify your face to login securely.</p>
          </div>
          
          <div class="form-group">
            <label>Username</label>
            <input id="username" type="text" placeholder="Enter your username" class="text-input" autofocus />
          </div>
          
          <div class="face-verification-box">
            <div class="camera-icon-large">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <p class="verification-text">Position your face in front of the camera</p>
            <p class="verification-note">Make sure you're in a well-lit area</p>
          </div>
          
          <button id="verify-face" class="primary-btn large">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Verify Face & Login
          </button>
          
          <div id="status" class="status-message"></div>
        </div>
        
        <div class="auth-footer">
          <p>Don't have an account? <a href="#" id="register-link">Register here</a></p>
        </div>
      </div>
    </div>
  `
  
  setupLoginEventListeners(onSuccess, onBack, onRegister)
}

function setupLoginEventListeners(onSuccess: () => void, onBack: () => void, onRegister: () => void) {
  const backBtn = document.getElementById('back-btn')
  const verifyBtn = document.getElementById('verify-face') as HTMLButtonElement
  const registerLink = document.getElementById('register-link')
  const usernameInput = document.getElementById('username') as HTMLInputElement
  const statusDiv = document.getElementById('status')!
  
  // Back button
  backBtn?.addEventListener('click', onBack)
  
  // Register link
  registerLink?.addEventListener('click', (e) => {
    e.preventDefault()
    onRegister()
  })
  
  // Enter key to login
  usernameInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      verifyBtn?.click()
    }
  })
  
  // Verify face and login
  verifyBtn?.addEventListener('click', async () => {
    const username = usernameInput.value.trim()
    
    if (!username) {
      showStatus('Please enter your username', 'error')
      return
    }
    
    try {
      showStatus('Verifying your face... Please look at the camera!', 'info')
      verifyBtn!.disabled = true
      
      const result = await loginWithFace(username)
      
      if (result.success) {
        showStatus(`✓ Login successful! Welcome back, ${result.user?.username}!`, 'success')
        
        // Show confidence if available
        if ((result as any).confidence) {
          setTimeout(() => {
            showStatus(`Match confidence: ${(result as any).confidence}`, 'info')
          }, 1000)
        }
        
        // Redirect after short delay
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        showStatus('Login failed. Please try again.', 'error')
        verifyBtn!.disabled = false
      }
      
    } catch (error: any) {
      showStatus(error.message, 'error')
      verifyBtn!.disabled = false
    }
  })
  
  function showStatus(message: string, type: 'info' | 'success' | 'error') {
    statusDiv.textContent = message
    statusDiv.className = `status-message ${type}`
  }
}
