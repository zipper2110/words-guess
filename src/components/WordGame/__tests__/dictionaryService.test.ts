import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchWordDefinition } from '../dictionaryService'

describe('dictionaryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console logs during tests
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should fetch word definition successfully', async () => {
    const mockApiResponse = [{
      meanings: [{
        definitions: [
          { definition: 'Used as a greeting' },
          { definition: 'To begin a conversation' }
        ]
      }]
    }]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse)
    })

    const result = await fetchWordDefinition('HELLO')

    expect(result).toEqual({
      word: 'HELLO',
      definitions: ['Used as a greeting', 'To begin a conversation']
    })
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.dictionaryapi.dev/api/v2/entries/en/hello',
      undefined
    )
  })

  it('should handle API errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })

    const result = await fetchWordDefinition('NONEXISTENT')

    expect(result).toBeNull()
  })

  it('should handle network errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await fetchWordDefinition('HELLO')

    expect(result).toBeNull()
  })

  it('should handle malformed responses', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{}])
    })

    const result = await fetchWordDefinition('HELLO')

    expect(result).toBeNull()
  })
}) 