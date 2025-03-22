import { GameState } from '../types'
import { fetchWordDefinition } from '../dictionaryService'
import { isValidWord } from '../../../utils/wordValidation'
import { 
  createFeedbackState, 
  resetGameState, 
  updateGuessedWords,
  checkLevelComplete 
} from '../../../utils/wordUtils'

export const useWordSubmission = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  guessedWords: string[],
  score: number,
  onScoreUpdate: (score: number) => void,
  onGuessedWordsUpdate?: (words: string[]) => void,
  setGuessedWords?: (words: string[]) => void,
  setIsLevelComplete?: (complete: boolean) => void
) => {
  const handleSubmit = async () => {
    const guess = gameState.userInput.toUpperCase()
    
    if (guessedWords.includes(guess)) {
      setGameState(prev => ({
        ...prev,
        ...resetGameState(prev.letterCounts),
        feedback: createFeedbackState('You already found this word!')
      }))
    } else if (isValidWord(guess, gameState.baseWord)) {
      const definition = await fetchWordDefinition(guess)
      if (definition) {
        const points = gameState.subWords.includes(guess) ? 100 : 200
        onScoreUpdate(score + points)
        const newGuessedWords = [...guessedWords, guess]
        
        updateGuessedWords(newGuessedWords, onGuessedWordsUpdate, setGuessedWords)
        
        setGameState(prev => ({
          ...prev,
          ...resetGameState(prev.letterCounts),
          feedback: createFeedbackState(`Correct word! +${points} points!`, 'success')
        }))
        
        if (setIsLevelComplete && checkLevelComplete(gameState.subWords, newGuessedWords)) {
          setIsLevelComplete(true)
        }
      } else {
        setGameState(prev => ({
          ...prev,
          ...resetGameState(prev.letterCounts),
          feedback: createFeedbackState('Not a valid English word. Try again!')
        }))
      }
    } else {
      setGameState(prev => ({
        ...prev,
        ...resetGameState(prev.letterCounts),
        feedback: createFeedbackState('Not a valid word. Try again!')
      }))
    }
  }

  return { handleSubmit }
} 