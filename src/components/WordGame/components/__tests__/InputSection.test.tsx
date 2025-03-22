import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import InputSection from '../InputSection'

describe('InputSection', () => {
  const mockProps = {
    userInput: '',
    baseWord: 'HELLO',
    availableLetters: { 'H': 1, 'E': 1, 'L': 2, 'O': 1 },
    isLevelComplete: false,
    onLetterClick: vi.fn(),
    onSubmit: vi.fn(),
    onBackspace: vi.fn(),
    onClear: vi.fn()
  }

  it('should render the input field and letter buttons', () => {
    render(<InputSection {...mockProps} />)
    
    expect(screen.getByPlaceholderText('Type your guess...')).toBeInTheDocument()
    
    // Should render all letters from the base word
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(5) // 5 letters + control buttons
    
    expect(screen.getByText('H')).toBeInTheDocument()
    expect(screen.getByText('E')).toBeInTheDocument()
    expect(screen.getAllByText('L')[0]).toBeInTheDocument() // Using getAllByText for duplicate letters
    expect(screen.getByText('O')).toBeInTheDocument()
  })

  it('should call onLetterClick when a letter button is clicked', () => {
    render(<InputSection {...mockProps} />)
    
    const hButton = screen.getByText('H')
    fireEvent.click(hButton)
    
    expect(mockProps.onLetterClick).toHaveBeenCalledWith('H')
  })

  it('should call onSubmit when submit button is clicked', () => {
    render(<InputSection {...mockProps} userInput="HELL" />)
    
    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)
    
    expect(mockProps.onSubmit).toHaveBeenCalled()
  })

  it('should disable submit button when input is empty', () => {
    render(<InputSection {...mockProps} userInput="" />)
    
    const submitButton = screen.getByText('Submit')
    expect(submitButton).toBeDisabled()
  })

  it('should call onBackspace when backspace button is clicked', () => {
    render(<InputSection {...mockProps} userInput="HELL" />)
    
    // Find backspace button using aria-label or test ID
    const backspaceButton = screen.getByTestId('backspace-button') || 
                           screen.getByLabelText('Backspace') ||
                           screen.getAllByRole('button').find(
                              button => button.innerHTML.includes('BackspaceIcon')
                            )
    
    expect(backspaceButton).toBeDefined()
    if (backspaceButton) {
      fireEvent.click(backspaceButton)
      expect(mockProps.onBackspace).toHaveBeenCalled()
    }
  })

  it('should call onClear when clear button is clicked', () => {
    render(<InputSection {...mockProps} userInput="HELL" />)
    
    // Find clear button using aria-label or test ID
    const clearButton = screen.getByTestId('clear-button') ||
                        screen.getByLabelText('Clear') ||
                        screen.getAllByRole('button').find(
                          button => button.innerHTML.includes('ClearIcon')
                        )
    
    expect(clearButton).toBeDefined()
    if (clearButton) {
      fireEvent.click(clearButton)
      expect(mockProps.onClear).toHaveBeenCalled()
    }
  })

  it('should disable letter buttons when no more letters are available', () => {
    render(<InputSection 
      {...mockProps} 
      availableLetters={{ 'H': 0, 'E': 1, 'L': 2, 'O': 1 }}
    />)
    
    // Find the H button - should be disabled
    const hButtons = screen.getAllByRole('button').filter(
      button => button.textContent === 'H'
    )
    
    expect(hButtons.length).toBeGreaterThan(0)
    expect(hButtons[0]).toBeDisabled()
  })

  it('should show "Level Complete!" when level is completed', () => {
    render(<InputSection {...mockProps} isLevelComplete={true} />)
    
    expect(screen.getByPlaceholderText('Level Complete!')).toBeInTheDocument()
    
    // All interactive elements should be disabled
    const submitButton = screen.getByText('Submit')
    expect(submitButton).toBeDisabled()
  })
}) 