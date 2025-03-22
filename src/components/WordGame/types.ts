export interface Level {
  baseWord: string;
  subWords: string[];
  index?: number;
}

export interface WordGameProps {
  level: Level | number;
  onLevelComplete: () => void;
  score: number;
  onScoreUpdate: (newScore: number) => void;
  guessedWords: string[];
  onGuessedWordsUpdate?: (words: string[]) => void;
  setGuessedWords?: (words: string[]) => void;
  subWords?: string[];
  onResetGame?: () => void;
  onMenuOpen?: (event: React.MouseEvent<HTMLElement>) => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  onClue?: () => void;
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
  letterCounts: Record<string, number>;
  availableLetters: Record<string, number>;
  revealedLetters: Record<string, Set<number>>;
}

export interface LetterButtonProps {
  letter: string;
  onClick: () => void;
  disabled?: boolean;
  remainingCount?: number;
}

export interface GameBoardProps {
  words?: string[];
  totalWords?: number;
  onShowDefinitions?: () => void;
  // Legacy props support
  subWords?: string[];
  guessedWords?: string[];
}

export interface DefinitionsModalProps {
  open: boolean;
  onClose: () => void;
  guessedWords?: string[];
  words?: string[];
  selectedWord?: string;
  onWordSelect?: (word: string) => void;
  definitions?: WordDefinition[];
  isLoadingDefinitions?: boolean;
}

export interface HelpModalProps {
  open: boolean;
  onClose: () => void;
} 