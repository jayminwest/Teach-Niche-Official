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
    
    // Check if dark mode class is applied
    expect(document.documentElement.classList.contains('chakra-ui-dark')).toBe(true)
  })

  it('opens and closes mobile menu', () => {
    renderHeader()
    
    // Open menu
    const menuButton = screen.getByLabelText('Open menu')
    fireEvent.click(menuButton)
    
    // Check if menu items are visible
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
    
    // Close menu
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    // Check if menu is closed
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
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
