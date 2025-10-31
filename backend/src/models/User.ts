import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  passwordHash?: string
  faceEncodings: number[][]
  faceImagePaths: string[]
  registrationComplete: boolean
  createdAt: Date
  lastLogin?: Date
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  passwordHash: {
    type: String,
    required: false
  },
  faceEncodings: {
    type: [[Number]],
    default: []
  },
  faceImagePaths: {
    type: [String],
    default: []
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
})

// Index for faster queries
userSchema.index({ username: 1 })
userSchema.index({ email: 1 })

export default mongoose.model<IUser>('User', userSchema)
