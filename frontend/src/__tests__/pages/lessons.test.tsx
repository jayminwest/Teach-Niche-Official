import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import Lessons from '../../pages/lessons'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

// Mock auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}))

describe('Lessons Page', () => {
  const mockRouter = {
    push: jest.fn()
  }
  
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter)
    mockUseAuth.mockReturnValue({
      session: { user: { id: '123' } },
      user: { email: 'test@example.com' }
    } as any)
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
})
