import { Level } from '../types'
import { LEVELS1 } from './levels1'
import { LEVELS2 } from './levels2'
import { LEVELS3 } from './levels3'
import { LEVELS4 } from './levels4'
import { LEVELS5 } from './levels5'

// Combine all level sets
export const LEVELS: Level[] = [...LEVELS1, ...LEVELS2, ...LEVELS3, ...LEVELS4, ...LEVELS5] 