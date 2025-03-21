import { WordDefinition } from './types'

// Helper function to add delay between API calls to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

export const fetchWordDefinition = async (word: string): Promise<WordDefinition | null> => {
  try {
    await delay(500)
    const response = await fetch(`${DICTIONARY_API}${word.toLowerCase()}`)
    if (!response.ok) {
      console.log(`Response status: ${response.status}`)
      console.log(`Response not OK: ${response.statusText}`)
      return null
    }
    const data = await response.json()
    const meanings = data[0].meanings
    const definitions = meanings[0]?.definitions.slice(0, 2).map((d: any) => d.definition)
    const result = definitions?.length ? {
      word,
      definitions
    } : null
    return result
  } catch (error) {
    console.error('Error fetching definition:', error)
    return null
  }
} 