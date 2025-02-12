import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Sidebar from './Sidebar'
import { SidebarProvider } from '@/contexts/SidebarContext'
import userEvent from '@testing-library/user-event'

// Mock fetch
global.fetch = vi.fn()

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful teamspaces fetch
    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            id: 'test-teamspace',
            title: 'Test TeamSpace',
            folders: [],
            notes: []
          }
        ])
      })
    )
  })

  const openMoreMenu = async () => {
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Test TeamSpace')).toBeInTheDocument()
    })

    const teamspaceDiv = screen.getByText('Test TeamSpace').closest('.group')
    if (!teamspaceDiv) throw new Error('Could not find teamspace div')
    
    // Trigger hover
    fireEvent.mouseEnter(teamspaceDiv)
    
    // Find and click the more button
    const moreButton = await screen.findByLabelText('More options')
    fireEvent.click(moreButton)
  }

  it('should open folder creation dialog and create folder successfully', async () => {
    // Setup
    const mockFetch = vi.fn().mockImplementation((url) => {
      if (url === '/api/folders') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'new-folder', title: 'New Folder' })
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{
          id: 'test-teamspace',
          title: 'Test TeamSpace',
          folders: [],
          notes: []
        }])
      })
    })
    global.fetch = mockFetch

    render(
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>
    )

    await openMoreMenu()

    // Click "New Folder"
    const newFolderButton = screen.getByRole('menuitem', { name: /new folder/i })
    fireEvent.click(newFolderButton)

    // Dialog should be open
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Enter folder name
    const input = screen.getByPlaceholderText(/folder name/i)
    fireEvent.change(input, { target: { value: 'Test Folder' } })

    // Click create
    const createButton = screen.getByRole('button', { name: /^create$/i })
    fireEvent.click(createButton)

    // Verify API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/folders', expect.any(Object))
    })

    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // UI should be interactive
    const teamspaceTitle = screen.getByText('Test TeamSpace')
    expect(teamspaceTitle).toBeEnabled()
    fireEvent.click(teamspaceTitle)
    expect(teamspaceTitle).toHaveBeenCalled
  })

  it('should handle folder creation error gracefully', async () => {
    const mockFetch = vi.fn().mockImplementation((url) => {
      if (url === '/api/folders') {
        return Promise.resolve({
          ok: false,
          status: 500
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{
          id: 'test-teamspace',
          title: 'Test TeamSpace',
          folders: [],
          notes: []
        }])
      })
    })
    global.fetch = mockFetch

    render(
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>
    )

    await openMoreMenu()

    // Open dialog and try to create folder
    const newFolderButton = screen.getByRole('menuitem', { name: /new folder/i })
    fireEvent.click(newFolderButton)
    const input = screen.getByPlaceholderText(/folder name/i)
    fireEvent.change(input, { target: { value: 'Test Folder' } })
    const createButton = screen.getByRole('button', { name: /^create$/i })
    fireEvent.click(createButton)

    // Should show error state but remain interactive
    await waitFor(() => {
      expect(createButton).not.toBeDisabled()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // UI should still be interactive
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should prevent multiple simultaneous folder creations', async () => {
    const mockFetch = vi.fn().mockImplementation((url) => {
      if (url === '/api/folders') {
        return new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'new-folder' })
        }), 1000))
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{
          id: 'test-teamspace',
          title: 'Test TeamSpace',
          folders: [],
          notes: []
        }])
      })
    })
    global.fetch = mockFetch

    render(
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>
    )

    await openMoreMenu()

    // Try to create folder
    const newFolderButton = screen.getByRole('menuitem', { name: /new folder/i })
    fireEvent.click(newFolderButton)
    const input = screen.getByPlaceholderText(/folder name/i)
    fireEvent.change(input, { target: { value: 'Test Folder' } })
    const createButton = screen.getByRole('button', { name: /^create$/i })
    
    // Click create multiple times
    fireEvent.click(createButton)
    fireEvent.click(createButton)
    fireEvent.click(createButton)

    // Should only make one API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2) // Initial load + one create
    })
  })
}) 