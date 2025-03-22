import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../useGameState'
import { fetchWordDefinition } from '../../dictionaryService'

// Mock the dictionary service
vi.mock('../../dictionaryService', () => ({
  fetchWordDefinition: vi.fn()
}))

describe('useGameState', () => {
  const mockProps = {
    level: {
      baseWord: 'HELLO',
      subWords: ['HELL', 'ELLO']
    },
    score: 0,
    guessedWords: [],
    onScoreUpdate: vi.fn(),
    onGuessedWordsUpdate: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(fetchWordDefinition as jest.Mock).mockResolvedValue({
      word: 'HELLO',
      definitions: ['Used as a greeting', 'To begin a conversation']
    })
  })

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useGameState(mockProps))

    expect(result.current.gameState.baseWord).toBe('HELLO')
    expect(result.current.gameState.subWords).toEqual(['HELL', 'ELLO'])
    expect(result.current.gameState.userInput).toBe('')
    expect(result.current.gameState.availableLetters).toEqual({
      'H': 1,
      'E': 1,
      'L': 2,
      'O': 1
    })
  })

  it('should handle letter click', () => {
    const { result } = renderHook(() => useGameState(mockProps))

    act(() => {
      result.current.handleLetterClick('H')
    })

    expect(result.current.gameState.userInput).toBe('H')
    expect(result.current.gameState.availableLetters['H']).toBe(0)
  })

  it('should not allow letter click when letter is not available', () => {
    const { result } = renderHook(() => useGameState(mockProps))

    act(() => {
      result.current.handleLetterClick('H')
      result.current.handleLetterClick('H')
    })

    expect(result.current.gameState.userInput).toBe('H')
    expect(result.current.gameState.availableLetters['H']).toBe(0)
  })

  it('should handle backspace', () => {
    const { result } = renderHook(() => useGameState(mockProps))

    act(() => {
      result.current.handleLetterClick('H')
      result.current.handleLetterClick('E')
      result.current.handleBackspace()
    })

    expect(result.current.gameState.userInput).toBe('H')
    expect(result.current.gameState.availableLetters['E']).toBe(1)
  })

  it('should handle clear', () => {
    const { result } = renderHook(() => useGameState(mockProps))

    act(() => {
      result.current.handleLetterClick('H')
      result.current.handleLetterClick('E')
      result.current.handleClear()
    })

    expect(result.current.gameState.userInput).toBe('')
    expect(result.current.gameState.availableLetters).toEqual({
      'H': 1,
      'E': 1,
      'L': 2,
      'O': 1
    })
  })

  it('should handle valid word submission', async () => {
    const { result } = renderHook(() => useGameState(mockProps))

    act(() => {
      result.current.handleLetterClick('H')
      result.current.handleLetterClick('E')
      result.current.handleLetterClick('L')
      result.current.handleLetterClick('L')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(mockProps.onScoreUpdate).toHaveBeenCalledWith(100)
    expect(mockProps.onGuessedWordsUpdate).toHaveBeenCalledWith(['HELL'])
    expect(result.current.gameState.userInput).toBe('')
    expect(result.current.gameState.availableLetters).toEqual({
      'H': 1,
      'E': 1,
      'L': 2,
      'O': 1
    })
  })

  it('should handle invalid word submission', async () => {
    const { result } = renderHook(() => useGameState(mockProps))

    act(() => {
      result.current.handleLetterClick('H')
      result.current.handleLetterClick('E')
      result.current.handleLetterClick('L')
      result.current.handleLetterClick('L')
      result.current.handleLetterClick('O')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(mockProps.onScoreUpdate).not.toHaveBeenCalled()
    expect(mockProps.onGuessedWordsUpdate).not.toHaveBeenCalled()
    expect(result.current.gameState.feedback.message).toBe('Not a valid word. Try again!')
    expect(result.current.gameState.feedback.type).toBe('error')
  })

  it('should handle duplicate word submission', async () => {
    const { result } = renderHook(() => useGameState({
      ...mockProps,
      guessedWords: ['HELL']
    }))

    act(() => {
      result.current.handleLetterClick('H')
      result.current.handleLetterClick('E')
      result.current.handleLetterClick('L')
      result.current.handleLetterClick('L')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(mockProps.onScoreUpdate).not.toHaveBeenCalled()
    expect(mockProps.onGuessedWordsUpdate).not.toHaveBeenCalled()
    expect(result.current.gameState.feedback.message).toBe('You already found this word!')
    expect(result.current.gameState.feedback.type).toBe('error')
  })

  it('should mark level as complete when all words are found', async () => {
    const { result } = renderHook(() => useGameState({
      ...mockProps,
      guessedWords: ['HELL']
    }))

    act(() => {
      result.current.handleLetterClick('E')
      result.current.handleLetterClick('L')
      result.current.handleLetterClick('L')
      result.current.handleLetterClick('O')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.isLevelComplete).toBe(true)
  })
}) 