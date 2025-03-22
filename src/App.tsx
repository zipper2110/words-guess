import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Container, Typography, Box, Button, ThemeProvider, CssBaseline, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { lightTheme, darkTheme } from './theme'
import WordGame from './components/WordGame/WordGame'
import { AdminPage } from './components/Admin/AdminPage'
import { LEVELS } from './data/levels'
import { Level } from './types'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LightbulbIcon from '@mui/icons-material/Lightbulb'

function App() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [guessedWords, setGuessedWords] = useState<string[]>([])
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
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
    setIsResetDialogOpen(false)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleResetClick = () => {
    handleMenuClose()
    setIsResetDialogOpen(true)
  }

  const handleClue = () => {
    handleMenuClose()
    const currentLevelData = LEVELS.find(l => l.index === currentLevel) || LEVELS[0]
    const unguessedWords = currentLevelData.subWords.filter(word => !guessedWords.includes(word))
    if (unguessedWords.length > 0) {
      const clueWord = unguessedWords[0]
      setGuessedWords(prev => [...prev, clueWord])
    }
  }

  const currentLevelData = LEVELS.find(l => l.index === currentLevel) || LEVELS[0]

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="md">
          <Box sx={{ my: 2, textAlign: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
            </Box>
          </Box>

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem 
              onClick={handleResetClick}
              sx={{ minWidth: 150 }}
            >
              <ListItemIcon>
                <RestartAltIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Reset Game</ListItemText>
            </MenuItem>
            <MenuItem 
              component={Link}
              to="/admin"
              onClick={handleMenuClose}
              sx={{ minWidth: 150 }}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Admin</ListItemText>
            </MenuItem>
          </Menu>

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
                    onMenuOpen={handleMenuOpen}
                    onThemeToggle={() => setIsDarkMode(!isDarkMode)}
                    isDarkMode={isDarkMode}
                    onClue={handleClue}
                  />
                </>
              } 
            />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Container>
      </Router>

      <Dialog
        open={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Reset Game?</DialogTitle>
        <DialogContent>
          <Typography>
            This will reset your progress to Level 1 and clear your score. Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsResetDialogOpen(false)}
            size="small"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleResetGame}
            color="error"
            variant="contained"
            size="small"
            autoFocus
          >
            Reset Game
          </Button>
        </DialogActions>
      </Dialog>

    </ThemeProvider>
  )
}

export default App 