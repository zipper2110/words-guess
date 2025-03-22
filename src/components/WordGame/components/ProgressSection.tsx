import { Box, Typography, Grid, Chip, Button, LinearProgress } from '@mui/material'

interface ProgressSectionProps {
  subWords: string[]
  guessedWords: string[]
  onShowDefinitions: () => void
  isLevelComplete: boolean
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  subWords,
  guessedWords,
  onShowDefinitions,
  isLevelComplete
}) => {
  return (
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
          {guessedWords.length} / {subWords.length}
        </Typography>
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={guessedWords.length > 0 ? Math.round((guessedWords.length / subWords.length) * 100) : 0} 
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
      {subWords.length > 0 && (
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Word Hints:
          </Typography>
          <Grid container spacing={0.5}>
            {subWords.map((word, wordIndex) => (
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
      {guessedWords.length > 0 && !isLevelComplete && (
        <Button
          variant="outlined"
          onClick={onShowDefinitions}
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
  )
}

export default ProgressSection 