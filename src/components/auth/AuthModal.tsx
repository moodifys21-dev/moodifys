import React, { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { setUser, setToken } = useAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.')
      return
    }

    setIsLoading(true)

    // Simulate authenticating session
    setTimeout(() => {
      setUser({
        id: 'usr-mood-101',
        email: email,
        fullName: fullName || (mode === 'signin' ? 'Vikramaditya Sen' : email.split('@')[0]),
        phone: '+91 98765 43210',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      setToken('mock-jwt-auth-token-valid')
      setIsLoading(false)
      onClose()
    }, 600)
  }

  const handleGuestDemo = () => {
    setUser({
      id: 'usr-guest-demo',
      email: 'demo@moodifys.com',
      fullName: 'Vikramaditya Sen',
      phone: '+91 98765 43210',
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setToken('mock-guest-token')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'signin' ? 'MEMBER SIGN IN' : 'CREATE ACCOUNT'} size="md">
      <div className="space-y-6 pt-2 select-none">
        
        {/* Toggle Mode Tab */}
        <div className="grid grid-cols-2 border border-[#BEBDBB] rounded-sm p-0.5 bg-[#F0EFED]">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setErrorMessage(null)
            }}
            className={`py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'signin'
                ? 'bg-[#090808] text-white shadow-xs'
                : 'text-[#302F2E] hover:text-[#090808]'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setErrorMessage(null)
            }}
            className={`py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'signup'
                ? 'bg-[#090808] text-white shadow-xs'
                : 'text-[#302F2E] hover:text-[#090808]'
            }`}
          >
            JOIN ARCHIVE
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                FULL NAME
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BEBDBB]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="VIKRAMADITYA SEN"
                  className="w-full bg-[#F0EFED] border border-[#BEBDBB] pl-9 pr-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#090808] focus:border-[#090808] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BEBDBB]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter@moodifys.com"
                className="w-full bg-[#F0EFED] border border-[#BEBDBB] pl-9 pr-3 py-2.5 text-xs font-bold tracking-wider text-[#090808] focus:border-[#090808] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BEBDBB]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F0EFED] border border-[#BEBDBB] pl-9 pr-3 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>
          )}

          <Button
            type="submit"
            variant="ink"
            size="md"
            className="w-full justify-between mt-2"
            disabled={isLoading}
          >
            <span>{isLoading ? 'AUTHENTICATING...' : mode === 'signin' ? 'ENTER ACCOUNT' : 'CREATE ACCOUNT'}</span>
            <ArrowRight size={15} />
          </Button>
        </form>

        {/* Quick Demo Login */}
        <div className="pt-3 border-t border-[#E1E0DC] text-center space-y-2">
          <button
            type="button"
            onClick={handleGuestDemo}
            className="text-xs font-bold uppercase tracking-widest text-[#302F2E] hover:text-[#090808] hover:underline"
          >
            CONTINUE WITH 1-CLICK DEMO PROFILE →
          </button>
        </div>

      </div>
    </Modal>
  )
}
