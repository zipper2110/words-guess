import { Box, Paper, Typography, Button, Grid, LinearProgress, Chip } from '@mui/material'

interface GameBoardProps {
  words?: string[];
  totalWords?: number;
  onShowDefinitions?: () => void;
  // Legacy props support
  subWords?: string[];
  guessedWords?: string[];
}

const GameBoard: React.FC<GameBoardProps> = (props) => {
  // Support both new and old prop patterns
  const words = props.words || props.guessedWords || [];
  const subWords = props.subWords || [];
  const allWords = subWords.length > 0 ? subWords : (props.totalWords ? Array(props.totalWords).fill('') : []);
  const totalWords = props.totalWords || allWords.length || 0;
  const onShowDefinitions = props.onShowDefinitions || (() => {});
  
  const progress = totalWords > 0 ? Math.round((words.length / totalWords) * 100) : 0;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}
    >
      {/* Compact Progress Header */}
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
          {words.length} / {totalWords}
        </Typography>
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={progress} 
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

      {/* Word Hints Section - Always Visible */}
      {allWords.length > 0 && (
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Word Hints:
          </Typography>
          <Grid container spacing={0.5}>
            {/* Display words in a grid - 2 per row on mobile, 3 on larger screens */}
            {allWords.map((word, wordIndex) => (
              <Grid item xs={6} sm={4} key={wordIndex}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 0.5, 
                  p: 0.5,
                  bgcolor: words.includes(word) ? 'success.light' : 'transparent',
                  borderRadius: 1,
                  justifyContent: 'center',
                  opacity: words.includes(word) ? 1 : 0.9
                }}>
                  {word.split('').map((letter: string, letterIndex: number) => (
                    <Box
                      key={letterIndex}
                      sx={{
                        width: { xs: 20, sm: 24 },
                        height: { xs: 20, sm: 24 },
                        border: '1px solid',
                        borderColor: words.includes(word) ? 'success.main' : 'primary.light',
                        borderRadius: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '0.6rem', sm: '0.8rem' },
                        fontWeight: 'bold',
                        backgroundColor: words.includes(word) ? 'success.light' : 'background.default',
                        color: words.includes(word) ? 'white' : 'text.primary',
                      }}
                    >
                      {letterIndex === 0 || words.includes(word) ? letter.toUpperCase() : ''}
                    </Box>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Found Words Section - Compact Chip Layout */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Found Words:
        </Typography>
        {words.length > 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 0.5 
          }}>
            {words.map((word, index) => (
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
      {words.length > 0 && (
        <Button
          variant="outlined"
          onClick={onShowDefinitions}
          size="small"
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            py: 0.5
          }}
        >
          Show Definitions
        </Button>
      )}
    </Paper>
  )
}

export default GameBoard 