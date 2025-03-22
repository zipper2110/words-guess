import { GameState } from '../types'
import { createFeedbackState } from '../../../utils/wordUtils'
import { updateGuessedWords, checkLevelComplete } from '../../../utils/wordUtils'

export const useClueSystem = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  guessedWords: string[],
  onGuessedWordsUpdate?: (words: string[]) => void,
  setGuessedWords?: (words: string[]) => void,
  setIsLevelComplete?: (complete: boolean) => void
) => {
  const handleClue = () => {
    const unguessedWords = gameState.subWords.filter(word => !guessedWords.includes(word))
    if (unguessedWords.length > 0) {
      const clueWord = unguessedWords[0]
      const revealedPositions = gameState.revealedLetters[clueWord] || new Set<number>([0])
      
      let nextPosition = 1
      while (nextPosition < clueWord.length && revealedPositions.has(nextPosition)) {
        nextPosition++
      }
      
      if (nextPosition < clueWord.length) {
        const newRevealedPositions = new Set([...revealedPositions, nextPosition])
        const allLettersRevealed = nextPosition === clueWord.length - 1
        
        setGameState(prev => ({
          ...prev,
          revealedLetters: {
            ...prev.revealedLetters,
            [clueWord]: newRevealedPositions
          },
          feedback: createFeedbackState(
            allLettersRevealed 
              ? `All letters revealed! The word is "${clueWord}"!`
              : `Clue: The letter '${clueWord[nextPosition]}' appears in position ${nextPosition + 1} of one of the remaining words`,
            'success'
          )
        }))

        if (allLettersRevealed) {
          const newGuessedWords = [...guessedWords, clueWord]
          updateGuessedWords(newGuessedWords, onGuessedWordsUpdate, setGuessedWords)
          
          if (setIsLevelComplete && checkLevelComplete(gameState.subWords, newGuessedWords)) {
            setIsLevelComplete(true)
          }
        }
      }
    }
  }

  return { handleClue }
} 