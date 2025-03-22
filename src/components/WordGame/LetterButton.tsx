import { Button, Box, useTheme } from '@mui/material'
import { LetterButtonProps } from './types'

const LetterButton: React.FC<LetterButtonProps> = ({ letter, onClick, disabled = false, remainingCount = 0 }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: { xs: 38, sm: 45 },
        height: { xs: 48, sm: 56 },
        minWidth: { xs: 38, sm: 45 },
        p: 0,
        fontSize: { xs: '1rem', sm: '1.2rem' },
        fontWeight: 'bold',
        borderRadius: 1.5,
        backgroundColor: disabled 
          ? 'grey.300' 
          : isDarkMode ? 'primary.light' : 'primary.main',
        color: disabled ? 'grey.600' : 'white',
        opacity: disabled ? 0.8 : 1,
        transform: disabled ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.2s ease',
        position: 'relative',
        '&:hover': {
          backgroundColor: disabled 
            ? 'grey.300' 
            : isDarkMode ? 'primary.main' : 'primary.dark',
          transform: disabled ? 'scale(0.95)' : 'scale(1.05)',
        },
        '&:disabled': {
          backgroundColor: 'grey.300',
          color: 'grey.600',
        }
      }}
    >
      {letter}
      {remainingCount > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            fontSize: '0.6rem',
            fontWeight: 'bold',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: 12,
            height: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'inherit'
          }}
        >
          {remainingCount}
        </Box>
      )}
    </Button>
  )
}

export default LetterButton 