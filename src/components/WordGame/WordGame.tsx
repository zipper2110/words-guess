import { useState, useEffect } from 'react'
import { Box, Button, TextField, Grid, Typography, Snackbar, Alert, Paper, IconButton, Container, LinearProgress, Chip } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import BackspaceIcon from '@mui/icons-material/Backspace'
import ClearIcon from '@mui/icons-material/Clear'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { LEVELS } from '../../data/levels'
import { WordGameProps, GameState, FeedbackState, WordDefinition } from './types'
import LetterButton from './LetterButton'
import GameBoard from './GameBoard'
import DefinitionsModal from './DefinitionsModal'
import HelpModal from './HelpModal'
import { fetchWordDefinition } from './dictionaryService'
import { isValidWord } from '../../utils/wordValidation'

const WordGame: React.FC<WordGameProps> = (props) => {
  const { 
    level, 
    onLevelComplete, 
    score, 
    onScoreUpdate,
    guessedWords,
    onGuessedWordsUpdate,
    subWords = [],
    setGuessedWords
  } = props;

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
    console.log('Level changed:', level)
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

  const handleNextLevel = () => {
    setIsLevelComplete(false)
    onLevelComplete()
  }

  const handleClue = () => {
    const unguessedWords = subWords.filter(word => !guessedWords.includes(word))
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

  return (
    <Container disableGutters maxWidth="sm" sx={{ px: 1, py: 1 }}>
      {/* Header with Score and Icons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1.5,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Score: {score}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handleClue}
            sx={{ color: '#DAA520' }}
            size="medium"
            aria-label="clue"
          >
            <LightbulbIcon />
          </IconButton>
          <IconButton
            onClick={() => setShowHelp(true)}
            color="primary"
            size="medium"
            aria-label="help"
          >
            <HelpIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Combined Game Board and Input Area */}
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 2,
          backgroundColor: 'background.paper',
          overflow: 'hidden'
        }}
      >
        {/* Game Board Component with Word Hints */}
        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          {/* Progress section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 1 
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Progress: 
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {guessedWords.length} / {gameState.subWords.length}
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={guessedWords.length > 0 ? Math.round((guessedWords.length / gameState.subWords.length) * 100) : 0} 
            sx={{ 
              height: 6,
              borderRadius: 3,
              mb: 1.5,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3
              }
            }} 
          />

          {/* Word Hints Section */}
          {gameState.subWords.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Word Hints:
              </Typography>
              <Grid container spacing={0.5}>
                {gameState.subWords.map((word, wordIndex) => (
                  <Grid item xs={6} sm={4} key={wordIndex}>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 0.5, 
                      p: 0.5,
                      bgcolor: guessedWords.includes(word) ? 'success.light' : 'transparent',
                      borderRadius: 1,
                      justifyContent: 'center',
                      opacity: guessedWords.includes(word) ? 1 : 0.9
                    }}>
                      {word.split('').map((letter, letterIndex) => (
                        <Box
                          key={letterIndex}
                          sx={{
                            width: { xs: 20, sm: 24 },
                            height: { xs: 20, sm: 24 },
                            border: '1px solid',
                            borderColor: guessedWords.includes(word) ? 'success.main' : 'primary.light',
                            borderRadius: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: { xs: '0.6rem', sm: '0.8rem' },
                            fontWeight: 'bold',
                            backgroundColor: guessedWords.includes(word) ? 'success.light' : 'background.default',
                            color: guessedWords.includes(word) ? 'white' : 'text.primary',
                          }}
                        >
                          {letterIndex === 0 || guessedWords.includes(word) ? letter.toUpperCase() : ''}
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Found Words Section */}
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Found Words:
            </Typography>
            {guessedWords.length > 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5 
              }}>
                {guessedWords.map((word, index) => (
                  <Chip
                    key={index}
                    label={word.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontSize: '0.75rem',
                      height: 'auto',
                      '& .MuiChip-label': {
                        px: 1,
                        py: 0.5
                      }
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                No words found yet
              </Typography>
            )}
          </Box>

          {/* Definitions Button */}
          {guessedWords.length > 0 && (
            <Button
              variant="outlined"
              onClick={handleShowDefinitions}
              size="small"
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                py: 0.5,
                mb: 1
              }}
            >
              Show Definitions
            </Button>
          )}
        </Box>
        
        {/* Divider */}
        <Box sx={{ height: '1px', bgcolor: 'divider' }} />
        
        {/* Input Area */}
        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          {/* Word Input Field */}
          <TextField
            fullWidth
            value={gameState.userInput}
            placeholder={isLevelComplete ? "Level Complete!" : "Type your guess..."}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                backgroundColor: 'background.default',
                height: { xs: 45, sm: 56 }
              }
            }}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Box sx={{ 
                  visibility: gameState.userInput ? 'visible' : 'hidden',
                  display: 'flex',
                  gap: 0.5
                }}>
                  <IconButton
                    onClick={handleBackspace}
                    disabled={!gameState.userInput || isLevelComplete}
                    size="small"
                  >
                    <BackspaceIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleClear}
                    disabled={!gameState.userInput || isLevelComplete}
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              )
            }}
          />

          {/* Letter Buttons Grid */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            gap: { xs: 0.75, sm: 1 },
            mb: 2
          }}>
            {gameState.baseWord.split('').map((letter, index) => (
              <LetterButton
                key={`${letter}-${index}`}
                letter={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={isLevelComplete || gameState.availableLetters[letter] === 0}
                remainingCount={gameState.availableLetters[letter]}
              />
            ))}
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!gameState.userInput || isLevelComplete}
            fullWidth
            size="medium"
            sx={{
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              borderRadius: 1.5,
              textTransform: 'none'
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>

      {/* Level Complete Message */}
      {isLevelComplete && (
        <Paper 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            bgcolor: 'success.light',
            color: 'white',
            mt: 1.5,
            borderRadius: 2
          }}
        >
          <Typography variant="h5" gutterBottom>
            🎉 Level Complete! 🎉
          </Typography>
          <Typography variant="body1" gutterBottom>
            Great job! Ready for the next challenge?
          </Typography>
          <Button
            variant="contained"
            onClick={handleNextLevel}
            sx={{ 
              mt: 2,
              bgcolor: 'white',
              color: 'success.dark',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Next Level
          </Button>
        </Paper>
      )}

      {/* Modals */}
      <DefinitionsModal
        open={gameState.showDefinitions}
        onClose={handleCloseDefinitions}
        guessedWords={guessedWords}
        selectedWord={gameState.selectedWord}
        onWordSelect={handleWordSelect}
        definitions={gameState.definitions}
        isLoadingDefinitions={gameState.isLoadingDefinitions}
      />

      <HelpModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Feedback Snackbar */}
      <Snackbar
        open={gameState.feedback.open}
        autoHideDuration={2000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
    </Container>
  )
}

export default WordGame 