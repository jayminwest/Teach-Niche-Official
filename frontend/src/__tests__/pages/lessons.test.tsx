import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import Lessons from '../../pages/lessons'

describe('Lessons Page', () => {
  const renderPage = () => {
    return render(
      <MockedProvider>
        <Lessons />
      </MockedProvider>
    )
  }

  it('renders the page title', () => {
    renderPage()
    const heading = screen.getByRole('heading', { name: /lessons/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the description text', () => {
    renderPage()
    const description = screen.getByText(/explore our collection/i)
    expect(description).toBeInTheDocument()
  })
})
