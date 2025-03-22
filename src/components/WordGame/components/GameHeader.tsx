import { Box, Typography, IconButton, SvgIcon } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { LEVELS } from '../../../data/levels'
import { Level } from '../types'

interface GameHeaderProps {
  level: number | Level
  score: number
  onHelpClick: () => void
  onThemeToggle?: () => void
  onMenuOpen?: (event: React.MouseEvent<HTMLElement>) => void
  onClue?: () => void
  isDarkMode?: boolean
}

const GameHeader: React.FC<GameHeaderProps> = ({
  level,
  score,
  onHelpClick,
  onThemeToggle = () => {},
  onMenuOpen = () => {},
  onClue = () => {},
  isDarkMode = false
}) => {
  const levelIndex = typeof level === 'object' ? level.index || 1 : level

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 1,
    }}>
      <Typography 
        component="span" 
        variant="body2"
        sx={{ 
          opacity: 0.8,
          flex: '0 0 auto'
        }}
      >
        Level {levelIndex}
      </Typography>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        mx: 2
      }}>
        <Typography 
          variant="caption" 
          component="div"
          sx={{ 
            opacity: 0.7,
            lineHeight: 1,
            mb: 0.25
          }}
        >
          Score
        </Typography>
        <Typography 
          variant="h6" 
          component="div"
          sx={{ 
            fontWeight: 'bold',
            lineHeight: 1
          }}
        >
          {score}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flex: '0 0 auto' }}>
        <IconButton
          onClick={onHelpClick}
          color="primary"
          size="medium"
          aria-label="help"
        >
          <HelpIcon />
        </IconButton>
        <IconButton 
          onClick={onThemeToggle}
          size="medium"
          aria-label="theme"
          sx={{
            color: isDarkMode ? '#fdd835' : '#5c6bc0',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: isDarkMode ? '#ffeb3b' : '#3f51b5',
              transform: 'rotate(12deg) scale(1.1)'
            }
          }}
        >
          {isDarkMode ? (
            <SvgIcon 
              sx={{ 
                fontSize: 22,
                filter: 'drop-shadow(0 0 4px rgba(253, 216, 53, 0.6))'
              }}
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M12 17.5q2.3 0 3.9-1.6t1.6-3.9q0-2.3-1.6-3.9T12 6.5q-2.3 0-3.9 1.6T6.5 12q0 2.3 1.6 3.9t3.9 1.6ZM1 13q-.425 0-.712-.288T0 12q0-.425.288-.712T1 11h2q.425 0 .713.288T4 12q0 .425-.288.713T3 13H1Zm18 0q-.425 0-.712-.288T18 12q0-.425.288-.712T19 11h2q.425 0 .713.288T22 12q0 .425-.288.713T21 13h-2ZM11 4q0-.425.288-.712T12 3q.425 0 .713.288T13 4v2q0 .425-.288.713T12 7q-.425 0-.712-.288T11 6V4ZM11 18q0-.425.288-.712T12 17q.425 0 .713.288T13 18v2q0 .425-.288.713T12 21q-.425 0-.712-.288T11 20v-2ZM5.65 7.05L4.575 6q-.3-.275-.288-.7t.288-.725q.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7t-.275.7q-.275.3-.687.288T5.65 7.05ZM18 19.425l-1.05-1.075q-.275-.3-.275-.712t.275-.688q.275-.3.688-.3t.712.3L19.425 18q.3.275.288.7t-.288.725q-.3.3-.725.3t-.7-.3ZM16.95 7.05q-.3-.275-.3-.675t.3-.7L18 4.575q.275-.3.7-.287t.725.287q.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275t-.7-.275ZM4.575 19.425q-.3-.3-.287-.725t.287-.7l1.075-1.05q.3-.275.713-.275t.687.275q.3.275.3.688t-.3.712l-1.075 1.05q-.275.3-.7.288t-.725-.288Z"/>
            </SvgIcon>
          ) : (
            <SvgIcon 
              sx={{ 
                fontSize: 22,
                filter: 'drop-shadow(0 0 4px rgba(92, 107, 192, 0.6))'
              }}
              viewBox="0 0 256 256"
            >
              <path fill="currentColor" d="M233.54 142.23a8 8 0 0 0-8-2a88.08 88.08 0 0 1-109.8-109.8a8 8 0 0 0-10-10a104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88a104.84 104.84 0 0 0 37-52.91a8 8 0 0 0-1.98-7.98Zm-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104a106 106 0 0 0 14.92-1.06a89 89 0 0 1-26.02 31.4Z"/>
            </SvgIcon>
          )}
        </IconButton>
        <IconButton
          onClick={onClue}
          size="medium"
          aria-label="get clue"
          sx={{
            color: '#DAA520',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#FFD700',
              transform: 'scale(1.1)'
            }
          }}
        >
          <LightbulbIcon />
        </IconButton>
        <IconButton
          onClick={onMenuOpen}
          color="inherit"
          size="medium"
          aria-label="menu"
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default GameHeader 