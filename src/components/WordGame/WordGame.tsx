import { useState, useEffect } from 'react'
import { Box, Button, TextField, Grid, Typography, Snackbar, Alert, Paper } from '@mui/material'
import { LEVELS } from '../../data/levels'
import { WordGameProps, GameState, FeedbackState, WordDefinition } from './types'
import { LetterButton } from './LetterButton'
import { GameBoard } from './GameBoard'
import { DefinitionsModal } from './DefinitionsModal'
import { fetchWordDefinition } from './dictionaryService'
import { isValidWord } from '../../utils/wordValidation'

const WordGame: React.FC<WordGameProps> = ({ 
  level, 
  onLevelComplete, 
  score, 
  onScoreUpdate,
  guessedWords,
  onGuessedWordsUpdate,
  subWords
}) => {
  const [gameState, setGameState] = useState<GameState>({
    baseWord: '',
    subWords: [],
    userInput: '',
    isLoadingDefinitions: false,
    showDefinitions: false,
    definitions: [],
    selectedWord: '',
    feedback: { message: '', type: 'success', open: false }
  })

  const [isLevelComplete, setIsLevelComplete] = useState(false)

  useEffect(() => {
    console.log('Level changed:', level)
    const currentLevel = LEVELS.find(l => l.index === level) || LEVELS[0]
    setGameState(prev => ({
      ...prev,
      baseWord: currentLevel.baseWord,
      subWords: currentLevel.subWords,
      userInput: '',
      definitions: [],
      selectedWord: ''
    }))
    setIsLevelComplete(false)
  }, [level])

  const handleLetterClick = (letter: string) => {
    if (!isLevelComplete) {
      setGameState(prev => ({ ...prev, userInput: prev.userInput + letter }))
    }
  }

  const handleSubmit = async () => {
    const guess = gameState.userInput.toUpperCase()
    
    if (guessedWords.includes(guess)) {
      setGameState(prev => ({
        ...prev,
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
        onScoreUpdate(points)
        const newGuessedWords = [...guessedWords, guess]
        onGuessedWordsUpdate(newGuessedWords)
        setGameState(prev => ({
          ...prev,
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
        feedback: {
          message: 'Not a valid word. Try again!',
          type: 'error',
          open: true
        }
      }))
    }
    setGameState(prev => ({ ...prev, userInput: '' }))
  }

  const handleBackspace = () => {
    if (!isLevelComplete) {
      setGameState(prev => ({
        ...prev,
        userInput: prev.userInput.slice(0, -1)
      }))
    }
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

  const handleNextLevel = () => {
    setIsLevelComplete(false)
    onLevelComplete()
  }

  const handleClue = () => {
    const unguessedWords = subWords.filter(word => !guessedWords.includes(word))
    if (unguessedWords.length > 0) {
      const clueWord = unguessedWords[0]
      const newGuessedWords = [...guessedWords, clueWord]
      onGuessedWordsUpdate(newGuessedWords)
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

  return (
    <Box>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h5" align="center" gutterBottom>
            Score: {score}
          </Typography>
        </Grid>

        {isLevelComplete && (
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                bgcolor: 'success.light',
                color: 'white',
                mb: 2
              }}
            >
              <Typography variant="h5" gutterBottom>
                🎉 Congratulations! 🎉
              </Typography>
              <Typography variant="body1" gutterBottom>
                You've completed this level! You're doing great!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextLevel}
                sx={{ mt: 2 }}
              >
                Continue to Next Level
              </Button>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <GameBoard
            subWords={gameState.subWords}
            guessedWords={guessedWords}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            value={gameState.userInput}
            placeholder={isLevelComplete ? "Level Complete!" : "Type your guess..."}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {gameState.baseWord.split('').map((letter, index) => (
              <LetterButton
                key={index}
                letter={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={isLevelComplete}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBackspace}
            disabled={!gameState.userInput || isLevelComplete}
          >
            Backspace
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!gameState.userInput || isLevelComplete}
          >
            Submit
          </Button>
          {guessedWords.length > 0 && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleShowDefinitions}
              disabled={gameState.isLoadingDefinitions}
            >
              Show Definitions
            </Button>
          )}
          <Button
            variant="outlined"
            color="info"
            onClick={handleClue}
            disabled={isLevelComplete || subWords.every(word => guessedWords.includes(word))}
            size="small"
          >
            Clue
          </Button>
        </Grid>
      </Grid>

      <DefinitionsModal
        open={gameState.showDefinitions}
        onClose={handleCloseDefinitions}
        guessedWords={guessedWords}
        selectedWord={gameState.selectedWord}
        onWordSelect={handleWordSelect}
        definitions={gameState.definitions}
        isLoadingDefinitions={gameState.isLoadingDefinitions}
      />

      <Snackbar
        open={gameState.feedback.open}
        autoHideDuration={2000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseFeedback} 
          severity={gameState.feedback.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {gameState.feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default WordGame 