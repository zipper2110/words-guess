import { useState, useEffect } from 'react'
import { LEVELS } from '../../../data/levels'
import { GameState, FeedbackState, WordDefinition, Level } from '../types'
import { fetchWordDefinition } from '../dictionaryService'
import { isValidWord } from '../../../utils/wordValidation'

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
    availableLetters: {}
  })

  const [isLevelComplete, setIsLevelComplete] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const initializeLetterCounts = (word: string) => {
      const counts: Record<string, number> = {}
      word.split('').forEach(letter => {
        counts[letter] = (counts[letter] || 0) + 1
      })
      return counts
    }

    if (typeof level === 'object' && level.baseWord) {
      const letterCounts = initializeLetterCounts(level.baseWord)
      setGameState(prev => ({
        ...prev,
        baseWord: level.baseWord,
        subWords: level.subWords || subWords || [],
        userInput: '',
        definitions: [],
        selectedWord: '',
        letterCounts,
        availableLetters: { ...letterCounts }
      }))
    } else if (typeof level === 'number') {
      const currentLevel = LEVELS.find(l => l.index === level) || LEVELS[0]
      const letterCounts = initializeLetterCounts(currentLevel.baseWord)
      setGameState(prev => ({
        ...prev,
        baseWord: currentLevel.baseWord,
        subWords: currentLevel.subWords || subWords || [],
        userInput: '',
        definitions: [],
        selectedWord: '',
        letterCounts,
        availableLetters: { ...letterCounts }
      }))
    }
    setIsLevelComplete(false)
  }, [level, subWords])

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

  const handleSubmit = async () => {
    const guess = gameState.userInput.toUpperCase()
    
    if (guessedWords.includes(guess)) {
      setGameState(prev => ({
        ...prev,
        userInput: '',
        availableLetters: { ...prev.letterCounts },
        feedback: {
          message: 'You already found this word!',
          type: 'error',
          open: true
        }
      }))
    } else if (isValidWord(guess, gameState.baseWord)) {
      // Check if it's a real word using the dictionary API
      const definition = await fetchWordDefinition(guess)
      if (definition) {
        const points = gameState.subWords.includes(guess) ? 100 : 200
        onScoreUpdate(score + points)
        const newGuessedWords = [...guessedWords, guess]
        
        // Support both function naming styles
        if (typeof onGuessedWordsUpdate === 'function') {
          onGuessedWordsUpdate(newGuessedWords)
        } else if (typeof setGuessedWords === 'function') {
          setGuessedWords(newGuessedWords)
        }
        
        setGameState(prev => ({
          ...prev,
          userInput: '',
          availableLetters: { ...prev.letterCounts },
          feedback: {
            message: `Correct word! +${points} points!`,
            type: 'success',
            open: true
          }
        }))
        
        const foundAllSubWords = gameState.subWords.every(word => 
          newGuessedWords.includes(word)
        )
        if (foundAllSubWords) {
          setIsLevelComplete(true)
        }
      } else {
        setGameState(prev => ({
          ...prev,
          userInput: '',
          availableLetters: { ...prev.letterCounts },
          feedback: {
            message: 'Not a valid English word. Try again!',
            type: 'error',
            open: true
          }
        }))
      }
    } else {
      setGameState(prev => ({
        ...prev,
        userInput: '',
        availableLetters: { ...prev.letterCounts },
        feedback: {
          message: 'Not a valid word. Try again!',
          type: 'error',
          open: true
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

  const handleCloseFeedback = () => {
    setGameState(prev => ({
      ...prev,
      feedback: { ...prev.feedback, open: false }
    }))
  }

  const handleShowDefinitions = async () => {
    setGameState(prev => ({
      ...prev,
      isLoadingDefinitions: true,
      showDefinitions: true
    }))
    
    const newDefinitions: WordDefinition[] = []
    for (const word of guessedWords) {
      const definition = await fetchWordDefinition(word)
      if (definition) {
        newDefinitions.push(definition)
      }
    }
    
    setGameState(prev => ({
      ...prev,
      definitions: newDefinitions,
      isLoadingDefinitions: false
    }))
  }

  const handleWordSelect = (word: string) => {
    setGameState(prev => ({ ...prev, selectedWord: word }))
  }

  const handleCloseDefinitions = () => {
    setGameState(prev => ({
      ...prev,
      showDefinitions: false,
      selectedWord: ''
    }))
  }

  const handleClue = () => {
    const unguessedWords = gameState.subWords.filter(word => !guessedWords.includes(word))
    if (unguessedWords.length > 0) {
      const clueWord = unguessedWords[0]
      const newGuessedWords = [...guessedWords, clueWord]
      
      // Support both function naming styles
      if (typeof onGuessedWordsUpdate === 'function') {
        onGuessedWordsUpdate(newGuessedWords)
      } else if (typeof setGuessedWords === 'function') {
        setGuessedWords(newGuessedWords)
      }
      
      setGameState(prev => ({
        ...prev,
        feedback: {
          message: `Clue revealed: ${clueWord}`,
          type: 'success',
          open: true
        }
      }))
      
      const foundAllSubWords = gameState.subWords.every(word => 
        newGuessedWords.includes(word)
      )
      if (foundAllSubWords) {
        setIsLevelComplete(true)
      }
    }
  }

  return {
    gameState,
    isLevelComplete,
    showHelp,
    setShowHelp,
    setIsLevelComplete,
    handleLetterClick,
    handleSubmit,
    handleBackspace,
    handleClear,
    handleCloseFeedback,
    handleShowDefinitions,
    handleWordSelect,
    handleCloseDefinitions,
    handleClue
  }
} 