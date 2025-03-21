import { Level } from '../types.js'
import { LEVELS1 } from '../data/levels1.js'
import { LEVELS2 } from '../data/levels2.js'
import { LEVELS3 } from '../data/levels3.js'
import { LEVELS4 } from '../data/levels4.js'
import { LEVELS5 } from '../data/levels5.js'
import fs from 'fs'
import path from 'path'

function sortSubwords(subWords: string[]): string[] {
  return [...subWords].sort((a, b) => {
    // First sort by length
    if (a.length !== b.length) {
      return a.length - b.length
    }
    // Then sort alphabetically
    return a.localeCompare(b)
  })
}

function updateLevelsFile(filePath: string, levels: Level[]) {
  const content = fs.readFileSync(filePath, 'utf-8')
  let updatedContent = content

  levels.forEach(level => {
    const sortedSubWords = sortSubwords(level.subWords)
    const originalSubWordsStr = JSON.stringify(level.subWords)
    const sortedSubWordsStr = JSON.stringify(sortedSubWords)
    
    // Replace the original subWords array with the sorted one
    updatedContent = updatedContent.replace(
      originalSubWordsStr,
      sortedSubWordsStr
    )
  })

  fs.writeFileSync(filePath, updatedContent)
  console.log(`Updated ${filePath}`)
}

// Sort subwords in all level files
const levelFiles = [
  { path: 'src/data/levels1.ts', levels: LEVELS1 },
  { path: 'src/data/levels2.ts', levels: LEVELS2 },
  { path: 'src/data/levels3.ts', levels: LEVELS3 },
  { path: 'src/data/levels4.ts', levels: LEVELS4 },
  { path: 'src/data/levels5.ts', levels: LEVELS5 }
]

levelFiles.forEach(({ path: filePath, levels }) => {
  updateLevelsFile(filePath, levels)
})

console.log('All level files have been updated with sorted subwords.') 