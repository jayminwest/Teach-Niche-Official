import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import Lessons from '../../pages/lessons'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'
import { loadStripe } from '@stripe/stripe-js'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

// Mock auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}))

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn()
}))

// Mock fetch
global.fetch = jest.fn()

describe('Lessons Page', () => {
  const mockRouter = {
    push: jest.fn()
  }
  
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
  const mockStripe = {
    redirectToCheckout: jest.fn()
  }
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter)
    mockUseAuth.mockReturnValue({
      session: { user: { id: '123' } },
      user: { email: 'test@example.com' }
    } as any)
    ;(loadStripe as jest.Mock).mockResolvedValue(mockStripe)
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ sessionId: 'test_session_id' })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderPage = () => {
    return render(
      <MockedProvider>
        <Lessons />
      </MockedProvider>
    )
  }

  it('renders the tabs', () => {
    renderPage()
    expect(screen.getByText('All Lessons')).toBeInTheDocument()
    expect(screen.getByText('My Purchased Lessons')).toBeInTheDocument()
  })

  it('renders the search and filter controls', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Search lessons...')).toBeInTheDocument()
    expect(screen.getByText('Newest First')).toBeInTheDocument()
  })

  it('handles search input', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText('Search lessons...')
    fireEvent.change(searchInput, { target: { value: 'React' } })
    expect(screen.getByText('Advanced React Patterns')).toBeInTheDocument()
    expect(screen.queryByText('TypeScript Mastery')).not.toBeInTheDocument()
  })

  it('handles sort selection', () => {
    renderPage()
    const sortSelect = screen.getByRole('combobox')
    fireEvent.change(sortSelect, { target: { value: 'price-high' } })
    const lessons = screen.getAllByRole('article')
    expect(lessons[0]).toHaveTextContent('59.99')
  })

  it('switches view mode', () => {
    renderPage()
    const gridButton = screen.getByLabelText('Grid view')
    const listButton = screen.getByLabelText('List view')
    
    fireEvent.click(listButton)
    expect(screen.getByRole('grid')).toHaveStyle({ gridTemplateColumns: '1' })
    
    fireEvent.click(gridButton)
    expect(screen.getByRole('grid')).not.toHaveStyle({ gridTemplateColumns: '1' })
  })

  it('handles lesson purchase', async () => {
    renderPage()
    const purchaseButton = screen.getAllByText('Purchase')[0]
    
    fireEvent.click(purchaseButton)
    
    await waitFor(() => {
      expect(loadStripe).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/stripe/checkout_session',
        expect.any(Object)
      )
      expect(mockStripe.redirectToCheckout).toHaveBeenCalledWith({
        sessionId: 'test_session_id'
      })
    })
  })

  it('handles tab switching', () => {
    renderPage()
    const purchasedTab = screen.getByText('My Purchased Lessons')
    
    fireEvent.click(purchasedTab)
    
    expect(screen.queryByText('Purchase')).not.toBeInTheDocument()
  })

  it('redirects to login when no session', () => {
    mockUseAuth.mockReturnValueOnce({ session: null } as any)
    renderPage()
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login')
  })
})
