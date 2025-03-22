import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameBoard from '../GameBoard'

describe('GameBoard', () => {
  const mockProps = {
    subWords: ['HELL', 'ELLO', 'HE', 'EL', 'LO'],
    guessedWords: ['HELL', 'HE'],
    onShowDefinitions: vi.fn()
  }

  it('should render the game board correctly', () => {
    render(<GameBoard {...mockProps} />)
    
    expect(screen.getByText('Progress:')).toBeInTheDocument()
    expect(screen.getByText('2 / 5')).toBeInTheDocument()
  })

  it('should display guessed words in the found words section', () => {
    render(<GameBoard {...mockProps} />)
    
    const foundWordsSection = screen.getByText('Found Words:').parentElement
    expect(foundWordsSection).toBeInTheDocument()
    
    expect(screen.getByText('HELL')).toBeInTheDocument()
    expect(screen.getByText('HE')).toBeInTheDocument()
  })

  it('should call onShowDefinitions when button is clicked', () => {
    render(<GameBoard {...mockProps} />)
    
    const definitionsButton = screen.getByText('Show Definitions')
    fireEvent.click(definitionsButton)
    
    expect(mockProps.onShowDefinitions).toHaveBeenCalled()
  })

  it('should display "No words found yet" when no words guessed', () => {
    render(<GameBoard {...mockProps} guessedWords={[]} />)
    
    expect(screen.getByText('No words found yet')).toBeInTheDocument()
  })

  it('should handle new API with words prop', () => {
    const newApiProps = {
      words: ['HELL', 'HE'],
      totalWords: 5,
      onShowDefinitions: vi.fn()
    }
    
    render(<GameBoard {...newApiProps} />)
    
    expect(screen.getByText('2 / 5')).toBeInTheDocument()
    expect(screen.getByText('HELL')).toBeInTheDocument()
    expect(screen.getByText('HE')).toBeInTheDocument()
  })
}) 