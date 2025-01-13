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

  it('renders with secondary variant', () => {
    render(<Button label="Secondary" variant="secondary" />)
    const button = screen.getByRole('button', { name: /secondary/i })
    expect(button).toHaveClass('bg-gray-200')
    expect(button).toHaveClass('text-gray-800')
  })

  it('renders disabled state', () => {
    render(<Button label="Disabled" disabled />)
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('bg-blue-500')
    expect(button).toHaveClass('text-white')
    expect(button).toHaveClass('opacity-50')
    expect(button).not.toHaveClass('hover:bg-blue-600')
  })

  it('applies custom class names', () => {
    render(<Button label="Custom" className="custom-class" />)
    const button = screen.getByRole('button', { name: /custom/i })
    expect(button).toHaveClass('custom-class')
  })

  it('has proper accessibility attributes', () => {
    render(<Button label="Accessible" aria-label="Test Label" />)
    const button = screen.getByRole('button', { name: /test label/i })
    expect(button).toHaveAttribute('aria-label', 'Test Label')
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn()
    render(<Button label="Disabled Click" onClick={handleClick} disabled />)
    
    await userEvent.click(screen.getByRole('button', { name: /disabled click/i }))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
