import { Paper, Typography, Button } from '@mui/material'

interface LevelCompleteMessageProps {
  onNextLevel: () => void
}

const LevelCompleteMessage: React.FC<LevelCompleteMessageProps> = ({
  onNextLevel
}) => {
  return (
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
        onClick={onNextLevel}
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
  )
}

export default LevelCompleteMessage 