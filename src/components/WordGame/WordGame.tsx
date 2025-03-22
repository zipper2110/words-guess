import { Box, Paper, Snackbar, Alert, Container } from '@mui/material'
import { WordGameProps } from './types'
import { useGameState } from './hooks/useGameState'
import GameHeader from './components/GameHeader'
import ProgressSection from './components/ProgressSection'
import InputSection from './components/InputSection'
import LevelCompleteMessage from './components/LevelCompleteMessage'
import DefinitionsModal from './DefinitionsModal'
import HelpModal from './HelpModal'

const WordGame: React.FC<WordGameProps> = (props) => {
  const { 
    level, 
    onLevelComplete, 
    score, 
    onScoreUpdate,
    guessedWords,
    onGuessedWordsUpdate,
    subWords = [],
    setGuessedWords,
    onMenuOpen,
    onThemeToggle,
    isDarkMode
  } = props;

  const {
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
  } = useGameState({
    level,
    score,
    guessedWords,
    subWords,
    onScoreUpdate,
    onGuessedWordsUpdate,
    setGuessedWords
  })

  const handleNextLevel = () => {
    setIsLevelComplete(false)
    onLevelComplete()
  }

  return (
    <Container disableGutters maxWidth="sm" sx={{ px: 1, pt: 0.5, pb: 1 }}>
      {/* Header with Score and Icons */}
      <GameHeader 
        level={level}
        score={score}
        onHelpClick={() => setShowHelp(true)}
        onThemeToggle={onThemeToggle}
        onMenuOpen={onMenuOpen}
        isDarkMode={isDarkMode}
        onClue={handleClue}
      />

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
        <ProgressSection 
          subWords={gameState.subWords}
          guessedWords={guessedWords}
          onShowDefinitions={handleShowDefinitions}
          isLevelComplete={isLevelComplete}
        />
        
        {/* Divider */}
        <Box sx={{ height: '1px', bgcolor: 'divider' }} />
        
        {/* Input Area */}
        <InputSection 
          userInput={gameState.userInput}
          baseWord={gameState.baseWord}
          availableLetters={gameState.availableLetters}
          isLevelComplete={isLevelComplete}
          onLetterClick={handleLetterClick}
          onSubmit={handleSubmit}
          onBackspace={handleBackspace}
          onClear={handleClear}
        />
      </Paper>

      {/* Level Complete Message */}
      {isLevelComplete && (
        <LevelCompleteMessage onNextLevel={handleNextLevel} />
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