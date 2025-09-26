import { render, screen } from '@testing-library/react'
import HomePage from '../app/page'

describe('Home Page', () => {
  it('renders the home page heading', () => {
    render(<HomePage />)
    
    expect(screen.getByRole('heading', { name: /Incia & Arvin/i, level: 1 })).toBeInTheDocument()
  })

  it('displays save the date section', () => {
    render(<HomePage />)
    
    expect(screen.getByRole('heading', { name: /Save the Date/i })).toBeInTheDocument()
  })

  it('contains RSVP button', () => {
    render(<HomePage />)
    
    expect(screen.getByRole('link', { name: /RSVP for Incia and Arvin's wedding/i })).toBeInTheDocument()
  })

  it('has proper accessibility features', () => {
    render(<HomePage />)
    
    // Check for skip link
    expect(screen.getByRole('link', { name: /Skip to main content/i })).toBeInTheDocument()
    
    // Check for main landmark
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1, name: /Incia & Arvin/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Save the Date/i })).toBeInTheDocument()
  })

  it('has descriptive alt texts for images', () => {
    render(<HomePage />)
    
    // Check for more descriptive alt texts in story section
    expect(screen.getByAltText(/Incia and Arvin as students at American International School/i)).toBeInTheDocument()
    expect(screen.getByAltText(/The magical Tuscany proposal moment/i)).toBeInTheDocument()
  })

  it('includes structured timing information', () => {
    render(<HomePage />)
    
    // Check for enhanced timing information in the Save the Date section
    expect(screen.getByText(/6:00 PM Bangladesh Standard Time/i)).toBeInTheDocument()
    expect(screen.getByText(/📍 Dhaka, Bangladesh/i)).toBeInTheDocument()
  })
})