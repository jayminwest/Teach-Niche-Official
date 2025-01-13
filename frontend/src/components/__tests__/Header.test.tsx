import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import Header from '../Header'
import { theme } from '../../lib/chakra'

describe('Header Component', () => {
  const renderHeader = () => {
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

  it('opens and closes mobile menu', () => {
    renderHeader()
    
    // Open menu
    const menuButton = screen.getByLabelText('Open menu')
    fireEvent.click(menuButton)
    
    // Check if mobile menu items are visible
    const mobileMenuItems = screen.getAllByText('Profile')
    expect(mobileMenuItems.length).toBe(2) // Desktop and mobile
    expect(screen.getAllByText('Logout').length).toBe(2)
    
    // Close menu
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    // Check if mobile menu is closed
    const profileButtons = screen.getAllByText('Profile')
    expect(profileButtons.length).toBe(1) // Only desktop menu remains
  })

  it('shows profile menu on desktop', () => {
    renderHeader()
    
    // Open profile menu
    const profileButton = screen.getByLabelText('User menu')
    fireEvent.click(profileButton)
    
    // Check profile menu items
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })
})
