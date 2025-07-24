import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './AuthForm.css'

const AuthForm = ({ mode = 'signin', onToggleMode, onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      let result
      if (mode === 'signin') {
        result = await signIn(email, password)
      } else if (mode === 'signup') {
        result = await signUp(email, password)
      } else if (mode === 'reset') {
        result = await resetPassword(email)
        if (!result.error) {
          setMessage('Password reset email sent! Check your inbox.')
        }
      }

      if (result.error) {
        setError(result.error.message)
      } else if (mode === 'signup') {
        setMessage('Check your email to confirm your account!')
      } else if (mode === 'signin' && onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Sign In'
      case 'signup': return 'Create Account'
      case 'reset': return 'Reset Password'
      default: return 'Authentication'
    }
  }

  const getButtonText = () => {
    if (loading) return 'Please wait...'
    switch (mode) {
      case 'signin': return 'Sign In'
      case 'signup': return 'Create Account'
      case 'reset': return 'Send Reset Email'
      default: return 'Submit'
    }
  }

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h2 className="auth-title">✈️ {getTitle()}</h2>
          <p className="auth-subtitle">
            {mode === 'signin' && 'Welcome back to Flight Rebooker'}
            {mode === 'signup' && 'Join Flight Rebooker today'}
            {mode === 'reset' && 'Enter your email to reset your password'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}

        <div className="auth-field">
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        {mode !== 'reset' && (
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength="6"
            />
          </div>
        )}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading}
        >
          {getButtonText()}
        </button>

        <div className="auth-links">
          {mode === 'signin' && (
            <>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => onToggleMode('reset')}
              >
                Forgot password?
              </button>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => onToggleMode('signup')}
              >
                Need an account? Sign up
              </button>
            </>
          )}
          
          {mode === 'signup' && (
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => onToggleMode('signin')}
            >
              Already have an account? Sign in
            </button>
          )}
          
          {mode === 'reset' && (
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => onToggleMode('signin')}
            >
              Back to sign in
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AuthForm