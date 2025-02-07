import { render, screen } from '@testing-library/react'
import Layout from '../Layout'
import { useAuth } from '../../context/AuthContext'

// Mock the dependencies
jest.mock('../../context/AuthContext')
jest.mock('../Header', () => () => <div data-testid="mock-header">Header</div>)
jest.mock('../Footer', () => () => <div data-testid="mock-footer">Footer</div>)
jest.mock('../Hero', () => () => <div data-testid="mock-hero">Hero</div>)

describe('Layout', () => {
  beforeEach(() => {
    // Default mock implementation for useAuth
    (useAuth as jest.Mock).mockReturnValue({ isLoading: false })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders children content', () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    )
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  it('shows loading spinner when auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoading: true })
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows header by default', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    expect(screen.getByTestId('mock-header')).toBeInTheDocument()
  })

  it('hides header when showHeader is false', () => {
    render(
      <Layout showHeader={false}>
        <div>Content</div>
      </Layout>
    )
    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument()
  })

  it('shows footer by default', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument()
  })

  it('hides footer when showFooter is false', () => {
    render(
      <Layout showFooter={false}>
        <div>Content</div>
      </Layout>
    )
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument()
  })

  it('shows hero section when showHero is true', () => {
    render(
      <Layout showHero>
        <div>Content</div>
      </Layout>
    )
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument()
  })

  it('hides hero section by default', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    expect(screen.queryByTestId('mock-hero')).not.toBeInTheDocument()
  })

  it('passes headerProps to Header component', () => {
    const headerProps = { testProp: 'test-value' }
    render(
      <Layout headerProps={headerProps}>
        <div>Content</div>
      </Layout>
    )
    expect(screen.getByTestId('mock-header')).toBeInTheDocument()
  })
})
