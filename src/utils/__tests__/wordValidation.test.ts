import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isValidWord, validateLevelWords } from '../wordValidation'
import { fetchWordDefinition } from '../../components/WordGame/dictionaryService'

// Mock the dictionary service
vi.mock('../../components/WordGame/dictionaryService', () => ({
  fetchWordDefinition: vi.fn()
}))

describe('isValidWord', () => {
  it('should return false if word is the same as base word', () => {
    expect(isValidWord('HELLO', 'HELLO')).toBe(false)
  })

  it('should return true for valid subwords', () => {
    expect(isValidWord('HELL', 'HELLO')).toBe(true)
    expect(isValidWord('ELLO', 'HELLO')).toBe(true)
  })

  it('should return false for invalid subwords', () => {
    expect(isValidWord('WORLD', 'HELLO')).toBe(false)
    expect(isValidWord('HELLOZ', 'HELLO')).toBe(false)
  })

  it('should handle case-insensitive comparison', () => {
    expect(isValidWord('hello', 'HELLO')).toBe(false)
    expect(isValidWord('HELL', 'hello')).toBe(true)
  })

  it('should handle repeated letters correctly', () => {
    expect(isValidWord('LLO', 'HELLO')).toBe(true)
    expect(isValidWord('LLLO', 'HELLO')).toBe(false)
  })

  it('should handle empty or single letter inputs', () => {
    expect(isValidWord('', 'HELLO')).toBe(true)
    expect(isValidWord('H', 'HELLO')).toBe(true)
    expect(isValidWord('X', 'HELLO')).toBe(false)
  })

  it('should handle special characters', () => {
    expect(isValidWord('HE-LLO', 'HELLO')).toBe(false)
    expect(isValidWord('HELL', 'HE-LLO')).toBe(false)
  })
})

describe('validateLevelWords', () => {
  const mockFetchWordDefinition = fetchWordDefinition as jest.Mock

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should validate base word length', async () => {
    mockFetchWordDefinition.mockResolvedValue({ 
      word: 'HELLO', 
      definitions: ['Used as a greeting']
    })
    
    const result = await validateLevelWords('HI', ['HELL'])
    
    expect(result.baseWordTooShort).toBe(true)
    expect(result.baseWordValid).toBe(false)
  })

  it('should validate base word is real', async () => {
    mockFetchWordDefinition.mockResolvedValue(null)
    
    const result = await validateLevelWords('HELLO', ['HELL'])
    
    expect(result.baseWordNotReal).toBe(true)
    expect(result.baseWordValid).toBe(false)
  })

  it('should detect duplicate words', async () => {
    mockFetchWordDefinition.mockResolvedValue({ 
      word: 'HELLO', 
      definitions: ['Used as a greeting']
    })
    
    const result = await validateLevelWords('HELLO', ['HELL', 'HELL', 'hell'])
    
    expect(result.duplicates).toEqual(['HELL', 'hell'])
  })

  it('should validate subwords', async () => {
    mockFetchWordDefinition.mockResolvedValue({ 
      word: 'HELLO', 
      definitions: ['Used as a greeting']
    })
    
    const result = await validateLevelWords('HELLO', ['HELL', 'WORLD', 'HE', 'EL'])
    
    expect(result.valid).toEqual(['HELL', 'HE', 'EL'])
    expect(result.invalid).toEqual(['WORLD'])
  })

  it('should check if words exist in dictionary', async () => {
    mockFetchWordDefinition.mockImplementation((word) => {
      if (word === 'HELLO' || word === 'HELL') {
        return Promise.resolve({ 
          word, 
          definitions: ['Test definition']
        })
      }
      return Promise.resolve(null)
    })
    
    const result = await validateLevelWords('HELLO', ['HELL', 'HE', 'EL'])
    
    expect(result.notRealWords).toEqual(['HE', 'EL'])
  })

  it('should check word lengths', async () => {
    mockFetchWordDefinition.mockImplementation((word) => {
      // We need to return definition for HELLO too
      if (['HELLO', 'HELL', 'HEL', 'HE'].includes(word)) {
        return Promise.resolve({ 
          word, 
          definitions: ['Used as a greeting']
        })
      }
      return Promise.resolve(null)
    })
    
    const result = await validateLevelWords('HELLO', ['HELLO', 'HELL', 'HEL', 'HE'])
    
    expect(result.has5LetterWord).toBe(true)
    expect(result.has4LetterWord).toBe(true)
    expect(result.has3LetterWord).toBe(true)
  })

  it('should handle empty subwords array', async () => {
    mockFetchWordDefinition.mockResolvedValue({ 
      word: 'HELLO', 
      definitions: ['Used as a greeting']
    })
    
    const result = await validateLevelWords('HELLO', [])
    
    expect(result.valid).toEqual([])
    expect(result.invalid).toEqual([])
    expect(result.duplicates).toEqual([])
    expect(result.has5LetterWord).toBe(false)
  })
}) 