import { useState } from 'react'
import { GameState, WordDefinition } from '../types'
import { fetchWordDefinition } from '../dictionaryService'

export const useDefinitions = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  guessedWords: string[]
) => {
  const handleShowDefinitions = async () => {
    setGameState(prev => ({
      ...prev,
      isLoadingDefinitions: true,
      showDefinitions: true
    }))
    
    const newDefinitions: WordDefinition[] = []
    for (const word of guessedWords) {
      const definition = await fetchWordDefinition(word)
      if (definition) {
        newDefinitions.push(definition)
      }
    }
    
    setGameState(prev => ({
      ...prev,
      definitions: newDefinitions,
      isLoadingDefinitions: false
    }))
  }

  const handleWordSelect = (word: string) => {
    setGameState(prev => ({ ...prev, selectedWord: word }))
  }

  const handleCloseDefinitions = () => {
    setGameState(prev => ({
      ...prev,
      showDefinitions: false,
      selectedWord: ''
    }))
  }

  return {
    handleShowDefinitions,
    handleWordSelect,
    handleCloseDefinitions
  }
} 