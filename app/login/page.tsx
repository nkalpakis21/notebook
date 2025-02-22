'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FcGoogle } from 'react-icons/fc'
import { signIn, signInWithGoogle } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      router.push('/dashboard')
      console.log('Login successful')
    } catch (error: any) {
      console.log('Login error:', error)
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-notion-default">
      <div className="bg-notion-sidebar p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-notion-text-primary">Login</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-500/10 text-red-500 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-notion-text-primary">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-notion-default border-notion-text-secondary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-notion-text-primary">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-notion-default border-notion-text-secondary/20"
            />
          </div>
          <Button type="submit" className="w-full bg-notion-text-primary text-notion-default hover:bg-notion-text-primary/90">
            Login
          </Button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-notion-text-secondary/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-notion-sidebar text-notion-text-secondary">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => signInWithGoogle()}
            className="w-full mt-4 border-notion-text-secondary/20 text-notion-text-primary hover:bg-notion-hover"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-notion-text-secondary">
          Don't have an account?{' '}
          <Link href="/signup" className="text-notion-text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
} 