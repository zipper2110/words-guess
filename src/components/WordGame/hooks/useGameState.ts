import { useState, useEffect } from 'react'
import { LEVELS } from '../../../data/levels'
import { GameState, Level } from '../types'
import { countLetters, resetGameState } from '../../../utils/wordUtils'
import { useLetterHandling } from './useLetterHandling'
import { useDefinitions } from './useDefinitions'
import { useClueSystem } from './useClueSystem'
import { useWordSubmission } from './useWordSubmission'

interface UseGameStateProps {
  level: Level | number
  score: number
  guessedWords: string[]
  subWords?: string[]
  onScoreUpdate: (newScore: number) => void
  onGuessedWordsUpdate?: (words: string[]) => void
  setGuessedWords?: (words: string[]) => void
}

export const useGameState = (props: UseGameStateProps) => {
  const { 
    level, 
    score, 
    guessedWords, 
    subWords = [],
    onScoreUpdate,
    onGuessedWordsUpdate,
    setGuessedWords
  } = props

  const [gameState, setGameState] = useState<GameState>({
    baseWord: typeof level === 'object' && level.baseWord ? level.baseWord : '',
    subWords: subWords || [],
    userInput: '',
    isLoadingDefinitions: false,
    showDefinitions: false,
    definitions: [],
    selectedWord: '',
    feedback: { message: '', type: 'success', open: false },
    letterCounts: {},
    availableLetters: {},
    revealedLetters: {}
  })

  const [isLevelComplete, setIsLevelComplete] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (typeof level === 'object' && level.baseWord) {
      const letterCounts = countLetters(level.baseWord)
      setGameState(prev => ({
        ...prev,
        baseWord: level.baseWord,
        subWords: level.subWords || subWords || [],
        ...resetGameState(letterCounts),
        letterCounts,
      }))
    } else if (typeof level === 'number') {
      const currentLevel = LEVELS.find(l => l.index === level) || LEVELS[0]
      const letterCounts = countLetters(currentLevel.baseWord)
      setGameState(prev => ({
        ...prev,
        baseWord: currentLevel.baseWord,
        subWords: currentLevel.subWords || subWords || [],
        ...resetGameState(letterCounts),
        letterCounts,
      }))
    }
    setIsLevelComplete(false)
  }, [level, subWords])

  const handleCloseFeedback = () => {
    setGameState(prev => ({
      ...prev,
      feedback: { ...prev.feedback, open: false }
    }))
  }

  const letterHandling = useLetterHandling(gameState, setGameState, isLevelComplete)
  const definitions = useDefinitions(gameState, setGameState, guessedWords)
  const clueSystem = useClueSystem(
    gameState, 
    setGameState, 
    guessedWords, 
    onGuessedWordsUpdate, 
    setGuessedWords,
    setIsLevelComplete
  )
  const wordSubmission = useWordSubmission(
    gameState,
    setGameState,
    guessedWords,
    score,
    onScoreUpdate,
    onGuessedWordsUpdate,
    setGuessedWords,
    setIsLevelComplete
  )

  return {
    gameState,
    isLevelComplete,
    showHelp,
    setShowHelp,
    setIsLevelComplete,
    handleCloseFeedback,
    ...letterHandling,
    ...definitions,
    ...clueSystem,
    ...wordSubmission
  }
} 