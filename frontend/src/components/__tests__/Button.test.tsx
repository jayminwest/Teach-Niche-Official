/**
 * Button component tests
 * @module Button
 * @see ../Button
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

/**
 * Test suite for Button component
 * @function describe
 * @param {string} 'Button' - Name of the test suite
 * @param {function} () => {} - Test suite implementation
 */
describe('Button', () => {
  /**
   * Test case: renders with primary variant by default
   * @function it
   * @param {string} 'renders with primary variant by default' - Test description
   * @param {function} () => {} - Test implementation
   */
  it('renders with primary variant by default', () => {
    render(<Button label="Test Button" />)
    const button = screen.getByRole('button', { name: /test button/i })
    expect(button).toHaveClass('bg-blue-500')
  })

  /**
   * Test case: calls onClick handler when clicked
   * @function it
   * @param {string} 'calls onClick handler when clicked' - Test description
   * @param {function} () => {} - Test implementation
   */
  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button label="Click Me" onClick={handleClick} />)
    
    await userEvent.click(screen.getByRole('button', { name: /click me/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
