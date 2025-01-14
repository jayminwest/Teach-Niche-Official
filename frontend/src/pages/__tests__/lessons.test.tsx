import { render, screen } from '@testing-library/react'
import Lessons from '../lessons'

describe('Lessons Page', () => {
  it('renders the page title', () => {
    render(<Lessons />)
    const heading = screen.getByRole('heading', { name: /lessons/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<Lessons />)
    const description = screen.getByText(/explore our collection/i)
    expect(description).toBeInTheDocument()
  })
})
