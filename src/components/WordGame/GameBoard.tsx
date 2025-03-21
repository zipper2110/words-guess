import { Box, Grid, Paper } from '@mui/material'

interface GameBoardProps {
  subWords: string[];
  guessedWords: string[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ subWords, guessedWords }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={1}>
        {subWords.map((word, wordIndex) => (
          <Grid item xs={12} key={wordIndex}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              {word.split('').map((letter, letterIndex) => (
                <Box
                  key={letterIndex}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  {letterIndex === 0 || guessedWords.includes(word) ? letter : ''}
                </Box>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
} 