import { Box, TextField, IconButton, Button } from '@mui/material'
import BackspaceIcon from '@mui/icons-material/Backspace'
import ClearIcon from '@mui/icons-material/Clear'
import LetterButton from '../LetterButton'

interface InputSectionProps {
  userInput: string
  baseWord: string
  availableLetters: Record<string, number>
  isLevelComplete: boolean
  onLetterClick: (letter: string) => void
  onSubmit: () => void
  onBackspace: () => void
  onClear: () => void
}

const InputSection: React.FC<InputSectionProps> = ({
  userInput,
  baseWord,
  availableLetters,
  isLevelComplete,
  onLetterClick,
  onSubmit,
  onBackspace,
  onClear
}) => {
  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
      {/* Word Input Field */}
      <TextField
        fullWidth
        value={userInput}
        placeholder={isLevelComplete ? "Level Complete!" : "Type your guess..."}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 1.5,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            backgroundColor: 'background.default',
            height: { xs: 45, sm: 56 }
          }
        }}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Box sx={{ 
              visibility: userInput ? 'visible' : 'hidden',
              display: 'flex',
              gap: 0.5
            }}>
              <IconButton
                onClick={onBackspace}
                disabled={!userInput || isLevelComplete}
                size="small"
              >
                <BackspaceIcon />
              </IconButton>
              <IconButton
                onClick={onClear}
                disabled={!userInput || isLevelComplete}
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </Box>
          )
        }}
      />

      {/* Letter Buttons Grid */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        gap: { xs: 0.75, sm: 1 },
        mb: 2
      }}>
        {baseWord.split('').map((letter, index) => (
          <LetterButton
            key={`${letter}-${index}`}
            letter={letter}
            onClick={() => onLetterClick(letter)}
            disabled={isLevelComplete || availableLetters[letter] === 0}
            remainingCount={availableLetters[letter]}
          />
        ))}
      </Box>

      {/* Submit Button */}
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={!userInput || isLevelComplete}
        fullWidth
        size="medium"
        sx={{
          py: { xs: 1, sm: 1.5 },
          fontSize: { xs: '0.95rem', sm: '1.1rem' },
          borderRadius: 1.5,
          textTransform: 'none'
        }}
      >
        Submit
      </Button>
    </Box>
  )
}

export default InputSection 