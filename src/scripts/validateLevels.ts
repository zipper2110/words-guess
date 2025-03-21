import { LEVELS } from '../data/levels.js'
import { validateLevelWords } from '../utils/wordValidation.js'

async function validateLevel(level: number) {
  const targetLevel = LEVELS.find(l => l.index === level)
  if (!targetLevel) {
    console.log(`Level ${level} not found`)
    return
  }

  console.log(`\nValidating level ${targetLevel.index} ("${targetLevel.baseWord}"):`)
  const { valid, invalid, duplicates, notRealWords, baseWordValid, baseWordTooShort, baseWordNotReal } = await validateLevelWords(targetLevel.baseWord, targetLevel.subWords)

  if (!baseWordValid) {
    console.log(`\nLevel ${targetLevel.index} ("${targetLevel.baseWord}"):`)
    if (baseWordTooShort) {
      console.log(`  Base word is too short (must be at least 5 letters)`)
    }
    if (baseWordNotReal) {
      console.log(`  Base word is not a valid English word`)
    }
  }
  if (invalid.length > 0) {
    console.log(`\nLevel ${targetLevel.index} ("${targetLevel.baseWord}"):`)
    invalid.forEach(word => {
      console.log(`  ${word} - Invalid word`)
    })
  }
  if (duplicates.length > 0) {
    console.log(`\nLevel ${targetLevel.index} ("${targetLevel.baseWord}"):`)
    duplicates.forEach(word => {
      console.log(`  ${word} - Duplicate word`)
    })
  }
  if (notRealWords.length > 0) {
    console.log(`\nLevel ${targetLevel.index} ("${targetLevel.baseWord}"):`)
    notRealWords.forEach(word => {
      console.log(`  ${word} - Not a real English word`)
    })
  }
}

async function validateLevelRange(start: number, end: number) {
  for (let level = start; level <= end; level++) {
    await validateLevel(level)
  }
}

async function validateAllLevels() {
  for (const level of LEVELS) {
    await validateLevel(level.index)
  }
}

// Get the level number(s) from command line arguments
const args = process.argv.slice(2)
if (args.length > 0) {
  if (args.length === 1) {
    // Single level validation
    const levelNumber = parseInt(args[0])
    if (isNaN(levelNumber)) {
      console.log('Please provide a valid level number')
      process.exit(1)
    }
    validateLevel(levelNumber)
  } else if (args.length === 2) {
    // Range validation
    const startLevel = parseInt(args[0])
    const endLevel = parseInt(args[1])
    if (isNaN(startLevel) || isNaN(endLevel)) {
      console.log('Please provide valid level numbers')
      process.exit(1)
    }
    if (startLevel > endLevel) {
      console.log('Start level must be less than or equal to end level')
      process.exit(1)
    }
    validateLevelRange(startLevel, endLevel)
  } else {
    console.log('Usage: npm run validate [level] or npm run validate [start] [end]')
    process.exit(1)
  }
} else {
  validateAllLevels()
}