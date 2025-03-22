import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LetterButton from '../LetterButton'

describe('LetterButton', () => {
  const mockProps = {
    letter: 'A',
    onClick: vi.fn(),
    disabled: false,
    remainingCount: 1
  }

  it('should render the letter', () => {
    render(<LetterButton {...mockProps} />)
    
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    render(<LetterButton {...mockProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<LetterButton {...mockProps} disabled={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not call onClick when disabled', () => {
    render(<LetterButton {...mockProps} disabled={true} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockProps.onClick).not.toHaveBeenCalled()
  })
  
  it('should show remaining count indicator for counts > 1', () => {
    render(<LetterButton {...mockProps} remainingCount={3} />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
  })
  
  it('should not show remaining count indicator for count <= 1', () => {
    render(<LetterButton {...mockProps} remainingCount={1} />)
    
    // A is the letter, but there should not be another '1' for the count
    const elements = screen.getAllByText('A')
    expect(elements.length).toBe(1)
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })
}) 