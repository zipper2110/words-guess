import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, Typography, List, ListItem, ListItemText, Box, CircularProgress, Button, DialogActions } from '@mui/material'
import { validateLevelWords } from '../utils/wordValidation'
import { LEVELS } from '../data/levels'
import { fetchWordDefinition } from './WordGame/dictionaryService'
import { Alert } from '@mui/material'
import { AlertColor } from '@mui/material/Alert'
import { ValidationResult } from '../utils/wordValidation'

interface ValidationModalProps {
  open: boolean
  onClose: () => void
}

function sortWords(words: string[]): string[] {
  return [...words].sort((a, b) => {
    // First sort by length
    if (a.length !== b.length) {
      return a.length - b.length
    }
    // Then sort alphabetically
    return a.localeCompare(b)
  })
}

export const ValidationModal: React.FC<ValidationModalProps> = ({ open, onClose }) => {
  const [validationResults, setValidationResults] = useState<Record<number, ValidationResult>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      validateAllLevels()
    }
  }, [open])

  const validateAllLevels = async () => {
    setIsLoading(true)
    const results: Record<number, ValidationResult> = {}

    for (const level of LEVELS) {
      setCurrentLevel(level.index)
      const result = await validateLevelWords(level.baseWord, level.subWords)
      results[level.index] = result
      setValidationResults(prev => ({ ...prev, [level.index]: result }))
    }

    setCurrentLevel(null)
    setIsLoading(false)
  }

  const hasInvalidWords = (result: ValidationResult) => {
    return !result.baseWordValid || result.invalid.length > 0 || result.duplicates.length > 0 || result.notRealWords.length > 0
  }

  const getWordStatus = (word: string, result: ValidationResult) => {
    if (!result.baseWordValid) return 'Base word too short'
    if (result.duplicates.includes(word)) return 'Duplicate'
    if (result.notRealWords.includes(word)) return 'Not a real word'
    if (result.invalid.includes(word)) return 'Invalid'
    return 'Valid'
  }

  const getWordColor = (word: string, result: ValidationResult) => {
    if (!result.baseWordValid) return 'error.main'
    if (result.duplicates.includes(word)) return 'warning.main'
    if (result.notRealWords.includes(word)) return 'error.main'
    if (result.invalid.includes(word)) return 'error.main'
    return 'success.main'
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Validate All Levels</DialogTitle>
      <DialogContent>
        <List>
          {LEVELS.map(level => {
            const result = validationResults[level.index] || { valid: [], invalid: [], duplicates: [], notRealWords: [], baseWordValid: true }
            const isCurrentLevel = currentLevel === level.index
            
            if (!hasInvalidWords(result)) return null
            
            const sortedInvalid = sortWords(result.invalid)
            const sortedDuplicates = sortWords(result.duplicates)
            const sortedNotRealWords = sortWords(result.notRealWords)
            const sortedValid = sortWords(result.valid)
            
            return (
              <ListItem key={level.index}>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      Level {level.index}: "{level.baseWord}"
                      {isCurrentLevel && <CircularProgress size={20} sx={{ ml: 1 }} />}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {!result.baseWordValid && (
                        <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
                          Base word must be at least 5 letters long
                        </Typography>
                      )}
                      {sortedInvalid.length > 0 && (
                        <>
                          <Typography color="error" gutterBottom>Invalid Words:</Typography>
                          <List dense>
                            {sortedInvalid.map((word, index) => (
                              <ListItem key={index}>
                                <ListItemText 
                                  primary={word}
                                  secondary={getWordStatus(word, result)}
                                  sx={{ 
                                    color: getWordColor(word, result),
                                    '& .MuiListItemText-secondary': {
                                      color: getWordColor(word, result)
                                    }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                      {sortedDuplicates.length > 0 && (
                        <>
                          <Typography color="warning.main" gutterBottom>Duplicate Words:</Typography>
                          <List dense>
                            {sortedDuplicates.map((word, index) => (
                              <ListItem key={index}>
                                <ListItemText 
                                  primary={word}
                                  secondary={getWordStatus(word, result)}
                                  sx={{ 
                                    color: getWordColor(word, result),
                                    '& .MuiListItemText-secondary': {
                                      color: getWordColor(word, result)
                                    }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                      {sortedNotRealWords.length > 0 && (
                        <>
                          <Typography color="error" gutterBottom>Not Real Words:</Typography>
                          <List dense>
                            {sortedNotRealWords.map((word, index) => (
                              <ListItem key={index}>
                                <ListItemText 
                                  primary={word}
                                  secondary={getWordStatus(word, result)}
                                  sx={{ 
                                    color: getWordColor(word, result),
                                    '& .MuiListItemText-secondary': {
                                      color: getWordColor(word, result)
                                    }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                      {sortedValid.length > 0 && (
                        <>
                          <Typography color="success.main" gutterBottom>Valid Words:</Typography>
                          <List dense>
                            {sortedValid.map((word, index) => (
                              <ListItem key={index}>
                                <ListItemText 
                                  primary={word}
                                  secondary={getWordStatus(word, result)}
                                  sx={{ 
                                    color: getWordColor(word, result),
                                    '& .MuiListItemText-secondary': {
                                      color: getWordColor(word, result)
                                    }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            )
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
} 