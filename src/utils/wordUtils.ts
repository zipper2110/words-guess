export const countLetters = (word: string): Record<string, number> => {
  return word.toLowerCase().split('').reduce((acc, letter) => {
    acc[letter] = (acc[letter] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

export const createFeedbackState = (message: string, type: 'success' | 'error' = 'error') => ({
  message,
  type,
  open: true
})

export const resetGameState = (letterCounts: Record<string, number>) => ({
  userInput: '',
  availableLetters: { ...letterCounts },
  feedback: { message: '', type: 'success' as const, open: false }
})

export const updateGuessedWords = (
  newGuessedWords: string[],
  onGuessedWordsUpdate?: (words: string[]) => void,
  setGuessedWords?: (words: string[]) => void
) => {
  if (typeof onGuessedWordsUpdate === 'function') {
    onGuessedWordsUpdate(newGuessedWords)
  } else if (typeof setGuessedWords === 'function') {
    setGuessedWords(newGuessedWords)
  }
}

export const checkLevelComplete = (subWords: string[], guessedWords: string[]): boolean => {
  return subWords.every(word => guessedWords.includes(word))
} 