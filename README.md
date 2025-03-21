# Word Game

A word puzzle game where players need to form valid words from a given base word.

## Game Rules

1. Each level presents a base word (e.g., "PAINTER")
2. Players must form valid English words using only the letters from the base word
3. Rules for word formation:
   - Words must be at least 3 letters long
   - Each letter can only be used as many times as it appears in the base word
   - Words must be valid English words (checked against a dictionary)
   - Words cannot be duplicates
   - Words must be formed using only the letters from the base word

4. Scoring:
   - Each valid word earns points based on its length
   - Longer words earn more points
   - The game tracks your progress and saves your current level and score

5. Features:
   - 50 challenging levels with increasing difficulty
   - Dictionary validation for all words
   - Progress saving
   - Clue system to help players
   - Admin interface for managing levels and words
   - Validation tools to ensure all words are valid and unique

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/word-game.git
   cd word-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally
- `npm run validate` - Run the level validation script to check for invalid or duplicate words

### Project Structure

```
src/
├── components/
│   ├── WordGame/         # Main game components
│   ├── Admin/           # Admin interface components
│   └── ValidationModal/ # Level validation modal
├── data/
│   └── levels.ts        # Game levels data
├── utils/
│   └── wordValidation.ts # Word validation logic
└── scripts/
    └── validateLevels.ts # Level validation script
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
