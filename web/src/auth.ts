// Authentication service for face recognition login/register

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/auth'

export interface User {
  username: string
  email: string
  lastLogin?: Date
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: User
  error?: string
}

// Check backend health
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`)
    return await response.json()
  } catch (error) {
    return {
      status: 'error',
      backend: 'disconnected',
      error: 'Cannot connect to backend server'
    }
  }
}

// Register new user - Step 1
export async function registerUser(username: string, email: string): Promise<{ userId: string }> {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed')
  }
  
  return { userId: data.userId }
}

// Capture face image - Step 2 (called 3 times)
export async function captureFace(userId: string, angleNumber: number) {
  const response = await fetch(`${API_URL}/register/capture-face`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, angleNumber })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Face capture failed')
  }
  
  return data
}

// Login with face verification
export async function loginWithFace(username: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed')
  }
  
  // Store token and user info
  if (data.token) {
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('username', data.user.username)
    localStorage.setItem('email', data.user.email)
  }
  
  return data
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken')
}

// Get current username
export function getUsername(): string | null {
  return localStorage.getItem('username')
}

// Get current user email
export function getEmail(): string | null {
  return localStorage.getItem('email')
}

// Logout
export function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('username')
  localStorage.removeItem('email')
}

// Get auth token for API requests
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken')
}
