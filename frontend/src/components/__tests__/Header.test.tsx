import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import Header from '../Header'
import { theme } from '../../lib/chakra'

// Mock the auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

import { useAuth } from '../../context/AuthContext'

describe('Header Component', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
  
  const renderHeader = (isAuthenticated = false) => {
    mockUseAuth.mockImplementation(() => ({
      user: isAuthenticated ? { email: 'test@example.com' } : null,
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
    }))
    
    return render(
      <ChakraProvider theme={theme}>
        <Header />
      </ChakraProvider>
    )
  }

  it('renders the logo and navigation items', () => {
    renderHeader()
    
    // Check logo
    expect(screen.getByText('Teach Niche')).toBeInTheDocument()
    
    // Check desktop navigation items
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Lessons')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('My Purchased Lessons')).toBeInTheDocument()
  })

  it('toggles dark mode', () => {
    renderHeader()
    
    const darkModeButton = screen.getByLabelText(/Toggle dark/i)
    fireEvent.click(darkModeButton)
    
    // Check if dark mode button icon changes
    expect(screen.getByLabelText(/Toggle light/i)).toBeInTheDocument()
  })

  it('opens and closes mobile menu', async () => {
    renderHeader(true)
    
    // Open menu
    const menuButton = screen.getByLabelText('Open menu')
    fireEvent.click(menuButton)
    
    // Check if mobile menu items are visible
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
    })
    
    // Close menu
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    // Check if mobile menu is hidden by checking transform style
    const dialog = screen.getByRole('dialog')
    await waitFor(() => {
      // Check that transform contains a large translateX value (close to 100%)
      expect(dialog.style.transform).toMatch(/translateX\(9\d\.\d+%\)/)
    })
    
    // Desktop profile menu should still be visible
    expect(screen.getByLabelText('User menu')).toBeInTheDocument()
  })

  it('shows profile menu on desktop', async () => {
    renderHeader(true)
    
    // Open profile menu
    const profileButton = screen.getByLabelText('User menu')
    fireEvent.click(profileButton)
    
    // Check profile menu items
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })
  })
})
