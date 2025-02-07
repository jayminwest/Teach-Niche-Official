import { render, screen, fireEvent } from '@testing-library/react'
import { LessonCard } from '../LessonCard'
import { ChakraProvider } from '@chakra-ui/react'

describe('LessonCard', () => {
  const defaultProps = {
    id: '1',
    title: 'Test Lesson',
    description: 'Test Description',
    price: 29.99,
    imageUrl: 'https://test.com/image.jpg'
  }

  const renderCard = (props = {}) => {
    return render(
      <ChakraProvider>
        <LessonCard {...defaultProps} {...props} />
      </ChakraProvider>
    )
  }

  it('renders unpurchased lesson correctly', () => {
    renderCard()
    expect(screen.getByText('Test Lesson')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('Purchase')).toBeInTheDocument()
  })

  it('renders purchased lesson correctly', () => {
    const purchasedDate = '2024-02-07T12:00:00Z'
    renderCard({
      isPurchased: true,
      purchasedAt: purchasedDate
    })
    expect(screen.getByText('Watch')).toBeInTheDocument()
    expect(screen.getByText(`Purchased: ${new Date(purchasedDate).toLocaleDateString()}`)).toBeInTheDocument()
  })

  it('shows new badge when isNew is true', () => {
    renderCard({ isNew: true })
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('calls onPurchaseClick when purchase button is clicked', () => {
    const onPurchaseClick = jest.fn()
    renderCard({ onPurchaseClick })
    
    fireEvent.click(screen.getByText('Purchase'))
    expect(onPurchaseClick).toHaveBeenCalled()
  })

  it('calls onPlayClick when watch button is clicked', () => {
    const onPlayClick = jest.fn()
    renderCard({
      isPurchased: true,
      purchasedAt: '2024-02-07T12:00:00Z',
      onPlayClick
    })
    
    fireEvent.click(screen.getByText('Watch'))
    expect(onPlayClick).toHaveBeenCalled()
  })

  it('handles purchase click errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const onPurchaseClick = () => { throw new Error('Purchase failed') }
    
    renderCard({ onPurchaseClick })
    fireEvent.click(screen.getByText('Purchase'))
    
    expect(consoleSpy).toHaveBeenCalledWith('Stripe error:', expect.any(Error))
    consoleSpy.mockRestore()
  })
})
