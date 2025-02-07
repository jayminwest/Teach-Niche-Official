import { render } from '@testing-library/react'
import { ChakraWrapper } from '../chakra'

describe('ChakraWrapper', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ChakraWrapper>
        <div>Test Content</div>
      </ChakraWrapper>
    )
    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('applies theme correctly', () => {
    const { container } = render(
      <ChakraWrapper>
        <div>Test Content</div>
      </ChakraWrapper>
    )
    // Check that the body background color is applied
    expect(document.body).toHaveStyle('background-color: var(--chakra-colors-gray-50)')
  })
})
