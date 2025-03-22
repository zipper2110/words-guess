import { Button } from '@mui/material'
import { LetterButtonProps } from './types'

const LetterButton: React.FC<LetterButtonProps> = ({ letter, onClick, disabled = false }) => {
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
        backgroundColor: disabled ? 'grey.300' : 'primary.main',
        '&:hover': {
          backgroundColor: disabled ? 'grey.300' : 'primary.dark',
        },
      }}
    >
      {letter}
    </Button>
  )
}

export default LetterButton 