"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-notion-default">
      <header className="border-b border-notion-text-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-notion-text-primary">DevNotes</h1>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-notion-text-primary mb-6">
            Engineering Notes Made Simple
          </h2>
          <p className="text-xl text-notion-text-secondary mb-8 max-w-2xl mx-auto">
            A dedicated space for your technical documentation, code snippets, and engineering knowledge. 
            Built by engineers, for engineers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Already have an account?</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 rounded-lg border border-notion-text-secondary/20">
            <h3 className="text-xl font-semibold text-notion-text-primary mb-3">Code Snippets</h3>
            <p className="text-notion-text-secondary">Store and organize your code snippets with syntax highlighting and searchable tags.</p>
          </div>
          <div className="p-6 rounded-lg border border-notion-text-secondary/20">
            <h3 className="text-xl font-semibold text-notion-text-primary mb-3">Team Collaboration</h3>
            <p className="text-notion-text-secondary">Share knowledge with your team through organized spaces and folders.</p>
          </div>
          <div className="p-6 rounded-lg border border-notion-text-secondary/20">
            <h3 className="text-xl font-semibold text-notion-text-primary mb-3">Markdown Support</h3>
            <p className="text-notion-text-secondary">Write technical documentation with full markdown support and live preview.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

