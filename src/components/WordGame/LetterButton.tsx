import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledButton = styled(Button)(({ theme }) => ({
  width: '48px',
  height: '48px',
  margin: '4px',
  borderRadius: '8px',
}))

interface LetterButtonProps {
  letter: string;
  onClick: () => void;
  disabled?: boolean;
}

export const LetterButton: React.FC<LetterButtonProps> = ({ letter, onClick, disabled }) => {
  return (
    <StyledButton
      variant="contained"
      onClick={onClick}
      disabled={disabled}
    >
      {letter}
    </StyledButton>
  )
} 