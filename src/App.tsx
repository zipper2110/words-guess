import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Container, Typography, Box, Button, ThemeProvider, CssBaseline } from '@mui/material'
import { lightTheme, darkTheme } from './theme'
import WordGame from './components/WordGame/WordGame'
import { AdminPage } from './components/Admin/AdminPage'
import { LEVELS } from './data/levels'
import { Level } from './types'

function App() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [guessedWords, setGuessedWords] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    const savedState = localStorage.getItem('gameState')
    if (savedState) {
      const { level, score, guessedWords } = JSON.parse(savedState)
      setCurrentLevel(level)
      setScore(score)
      setGuessedWords(guessedWords)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify({
      level: currentLevel,
      score,
      guessedWords
    }))
  }, [currentLevel, score, guessedWords])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore)
  }

  const handleLevelComplete = () => {
    setGuessedWords([])
    if (currentLevel < LEVELS.length) {
      setCurrentLevel(prev => prev + 1)
    }
  }

  const handleResetGame = () => {
    setCurrentLevel(1)
    setScore(0)
    setGuessedWords([])
  }

  const currentLevelData = LEVELS.find(l => l.index === currentLevel) || LEVELS[0]

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="md">
          <Box sx={{ my: 4, textAlign: 'center' }}>
            <Typography variant="h6" component="h1" gutterBottom>
              Level {currentLevel} of {LEVELS.length}
            </Typography>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleResetGame}
                sx={{ minWidth: '100px' }}
              >
                Reset Game
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/admin"
                sx={{ minWidth: '100px' }}
              >
                Admin
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsDarkMode(!isDarkMode)}
                sx={{ minWidth: '100px' }}
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Box>
          </Box>

          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <WordGame
                    level={currentLevel}
                    onLevelComplete={handleLevelComplete}
                    score={score}
                    onScoreUpdate={handleScoreUpdate}
                    guessedWords={guessedWords}
                    onGuessedWordsUpdate={setGuessedWords}
                    subWords={currentLevelData.subWords}
                  />
                </>
              } 
            />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App 