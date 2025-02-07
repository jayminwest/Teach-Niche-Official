import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

// Mock next/link since we're not doing actual navigation in tests
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Footer', () => {
  it('renders correctly', () => {
    render(<Footer />)
    
    // Check for main navigation links
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Terms')).toBeInTheDocument()
    expect(screen.getByText('Privacy')).toBeInTheDocument()

    // Check for social media links
    expect(screen.getByText('Twitter')).toBeInTheDocument()
    expect(screen.getByText('Facebook')).toBeInTheDocument()

    // Check for copyright text
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} LearnPlatform. All rights reserved.`)).toBeInTheDocument()
  })

  it('has correct link hrefs', () => {
    render(<Footer />)

    // Internal links
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Terms').closest('a')).toHaveAttribute('href', '/legal#terms')
    expect(screen.getByText('Privacy').closest('a')).toHaveAttribute('href', '/legal#privacy')

    // External links
    expect(screen.getByText('Twitter').closest('a')).toHaveAttribute('href', 'https://twitter.com')
    expect(screen.getByText('Facebook').closest('a')).toHaveAttribute('href', 'https://facebook.com')
  })

  it('has external links with correct attributes', () => {
    render(<Footer />)
    
    const twitterLink = screen.getByText('Twitter').closest('a')
    const facebookLink = screen.getByText('Facebook').closest('a')

    expect(twitterLink).toHaveAttribute('target', '_blank')
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(facebookLink).toHaveAttribute('target', '_blank')
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
