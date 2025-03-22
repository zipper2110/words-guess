import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import WordGame from '../WordGame'
import { fetchWordDefinition } from '../dictionaryService'

// Mock the dictionary service
vi.mock('../dictionaryService', () => ({
  fetchWordDefinition: vi.fn()
}))

describe('WordGame', () => {
  const mockProps = {
    level: {
      baseWord: 'HELLO',
      subWords: ['HELL', 'ELLO']
    },
    score: 0,
    guessedWords: [],
    onScoreUpdate: vi.fn(),
    onGuessedWordsUpdate: vi.fn(),
    onLevelComplete: vi.fn(),
    onMenuOpen: vi.fn(),
    onThemeToggle: vi.fn(),
    isDarkMode: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(fetchWordDefinition as jest.Mock).mockResolvedValue({
      word: 'HELLO',
      definitions: ['Used as a greeting', 'To begin a conversation']
    })
  })

  it('should render game board with correct base word', () => {
    render(<WordGame {...mockProps} />)
    
    expect(screen.getByText('HELLO')).toBeInTheDocument()
  })

  it('should handle letter clicks', () => {
    render(<WordGame {...mockProps} />)
    
    const letterButton = screen.getByRole('button', { name: /H/i })
    fireEvent.click(letterButton)
    
    expect(screen.getByDisplayValue('H')).toBeInTheDocument()
  })

  it('should handle word submission', async () => {
    render(<WordGame {...mockProps} />)
    
    // Type HELL
    fireEvent.click(screen.getByRole('button', { name: /H/i }))
    fireEvent.click(screen.getByRole('button', { name: /E/i }))
    fireEvent.click(screen.getByRole('button', { name: /L/i }))
    fireEvent.click(screen.getByRole('button', { name: /L/i }))
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(mockProps.onScoreUpdate).toHaveBeenCalledWith(100)
      expect(mockProps.onGuessedWordsUpdate).toHaveBeenCalledWith(['HELL'])
    })
  })

  it('should show feedback for invalid words', async () => {
    render(<WordGame {...mockProps} />)
    
    // Type invalid word
    fireEvent.click(screen.getByRole('button', { name: /H/i }))
    fireEvent.click(screen.getByRole('button', { name: /E/i }))
    fireEvent.click(screen.getByRole('button', { name: /L/i }))
    fireEvent.click(screen.getByRole('button', { name: /L/i }))
    fireEvent.click(screen.getByRole('button', { name: /O/i }))
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Not a valid word. Try again!')).toBeInTheDocument()
    })
  })

  it('should show level complete message when all words are found', async () => {
    render(<WordGame {...mockProps} guessedWords={['HELL']} />)
    
    // Type ELLO
    fireEvent.click(screen.getByRole('button', { name: /E/i }))
    fireEvent.click(screen.getByRole('button', { name: /L/i }))
    fireEvent.click(screen.getByRole('button', { name: /L/i }))
    fireEvent.click(screen.getByRole('button', { name: /O/i }))
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Level Complete!/i)).toBeInTheDocument()
    })
  })

  it('should handle theme toggle', () => {
    render(<WordGame {...mockProps} />)
    
    fireEvent.click(screen.getByRole('button', { name: /theme/i }))
    
    expect(mockProps.onThemeToggle).toHaveBeenCalled()
  })

  it('should handle menu open', () => {
    render(<WordGame {...mockProps} />)
    
    fireEvent.click(screen.getByRole('button', { name: /menu/i }))
    
    expect(mockProps.onMenuOpen).toHaveBeenCalled()
  })

  it('should show help modal', () => {
    render(<WordGame {...mockProps} />)
    
    fireEvent.click(screen.getByRole('button', { name: /help/i }))
    
    expect(screen.getByText(/How to Play/i)).toBeInTheDocument()
  })
}) 