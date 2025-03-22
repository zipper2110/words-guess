import { fetchWordDefinition } from "../components/WordGame/dictionaryService"
import { countLetters } from './wordUtils'

export interface ValidationResult {
  valid: string[]
  invalid: string[]
  duplicates: string[]
  notRealWords: string[]
  baseWordValid: boolean
  baseWordTooShort: boolean
  baseWordNotReal: boolean
  has5LetterWord: boolean
  has3LetterWord: boolean
  has4LetterWord: boolean
}

export async function validateLevelWords(baseWord: string, subWords: string[]): Promise<ValidationResult> {
  const valid: string[] = []
  const invalid: string[] = []
  const duplicates = new Set<string>()
  const seen = new Set<string>()
  const notRealWords: string[] = []
  
  // Check if base word is at least 5 letters long and is a valid English word
  const baseWordTooShort = baseWord.length < 5
  let baseWordNotReal = false
  if (!baseWordTooShort) {
    const baseWordDefinition = await fetchWordDefinition(baseWord)
    baseWordNotReal = baseWordDefinition === null
  }
  const baseWordValid = !baseWordTooShort && !baseWordNotReal

  // Check for duplicates
  subWords.forEach((word: string) => {
    const lower = word.toLowerCase()
    if (seen.has(lower)) {
      duplicates.add(word)
    }
    seen.add(lower)
  })
  
  // Check if each word can be formed from base word
  subWords.forEach(word => {
    if (isValidWord(word, baseWord) || word.toUpperCase() === baseWord.toUpperCase()) {
      valid.push(word)
    } else {
      invalid.push(word)
    }
  })
  
  // Check all words against the dictionary
  for (const word of [...valid]) {
    const definition = await fetchWordDefinition(word)
    if (!definition) {
      notRealWords.push(word)
    }
  }

  // Check for required word lengths
  const validWords = valid.filter(word => !notRealWords.includes(word))
  const has5LetterWord = validWords.some(word => word.length === 5)
  const has3LetterWord = validWords.some(word => word.length === 3)
  const has4LetterWord = validWords.some(word => word.length === 4)

  return {
    valid,
    invalid,
    duplicates: Array.from(duplicates),
    notRealWords,
    baseWordValid,
    baseWordTooShort,
    baseWordNotReal,
    has5LetterWord,
    has3LetterWord,
    has4LetterWord
  }
}

export function isValidWord(word: string, baseWord: string): boolean {
  // Don't allow the exact base word
  if (word.toLowerCase() === baseWord.toLowerCase()) {
    return false;
  }
  
  // Check for special characters - return false if found in either word
  if (/[^a-zA-Z]/.test(word) || /[^a-zA-Z]/.test(baseWord)) {
    return false;
  }
  
  const baseLetters = countLetters(baseWord)
  const wordLetters = countLetters(word)

  return Object.entries(wordLetters).every(([letter, count]) => 
    (baseLetters[letter] || 0) >= count
  )
}
