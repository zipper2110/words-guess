export interface WordGameProps {
  level: number
  onLevelComplete: () => void
  score: number
  onScoreUpdate: (points: number) => void
  guessedWords: string[]
  onGuessedWordsUpdate: (words: string[]) => void
  subWords: string[]
}

export interface WordDefinition {
  word: string;
  definitions: string[];
}

export interface FeedbackState {
  message: string;
  type: 'success' | 'error';
  open: boolean;
}

export interface GameState {
  baseWord: string;
  subWords: string[];
  userInput: string;
  isLoadingDefinitions: boolean;
  showDefinitions: boolean;
  definitions: WordDefinition[];
  selectedWord: string;
  feedback: FeedbackState;
} 