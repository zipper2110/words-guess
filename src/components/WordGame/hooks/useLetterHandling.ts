import { GameState } from '../types'
import { countLetters } from '../../../utils/wordUtils'

export const useLetterHandling = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  isLevelComplete: boolean
) => {
  const handleLetterClick = (letter: string) => {
    if (!isLevelComplete && gameState.availableLetters[letter] > 0) {
      setGameState(prev => ({
        ...prev,
        userInput: prev.userInput + letter,
        availableLetters: {
          ...prev.availableLetters,
          [letter]: prev.availableLetters[letter] - 1
        }
      }))
    }
  }

  const handleBackspace = () => {
    setGameState(prev => {
      if (!prev.userInput) return prev
      
      const lastLetter = prev.userInput[prev.userInput.length - 1]
      return {
        ...prev,
        userInput: prev.userInput.slice(0, -1),
        availableLetters: {
          ...prev.availableLetters,
          [lastLetter]: prev.availableLetters[lastLetter] + 1
        }
      }
    })
  }

  const handleClear = () => {
    setGameState(prev => ({
      ...prev,
      userInput: '',
      availableLetters: { ...prev.letterCounts }
    }))
  }

  return {
    handleLetterClick,
    handleBackspace,
    handleClear
  }
} 