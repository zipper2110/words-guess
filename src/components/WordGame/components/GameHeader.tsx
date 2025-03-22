import { Box, Typography, IconButton, SvgIcon } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { LEVELS } from '../../../data/levels'
import { Level } from '../types'

interface GameHeaderProps {
  level: number | Level
  score: number
  onHelpClick: () => void
  onThemeToggle?: () => void
  onMenuOpen?: (event: React.MouseEvent<HTMLElement>) => void
  isDarkMode?: boolean
}

const GameHeader: React.FC<GameHeaderProps> = ({
  level,
  score,
  onHelpClick,
  onThemeToggle = () => {},
  onMenuOpen = () => {},
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
        Level {levelIndex}/{LEVELS.length}
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
              viewBox="0 0 256 256"
            >
              <path fill="currentColor" d="M120 40V16a8 8 0 0 1 16 0v24a8 8 0 0 1-16 0Zm72 88a64 64 0 1 1-64-64a64.07 64.07 0 0 1 64 64Zm-16 0a48 48 0 1 0-48 48a48.05 48.05 0 0 0 48-48ZM58.34 69.66a8 8 0 0 0 11.32-11.32l-16-16a8 8 0 0 0-11.32 11.32Zm0 116.68l-16 16a8 8 0 0 0 11.32 11.32l16-16a8 8 0 0 0-11.32-11.32ZM192 72a8 8 0 0 0 5.66-2.34l16-16a8 8 0 0 0-11.32-11.32l-16 16A8 8 0 0 0 192 72Zm5.66 114.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32-11.32ZM48 128a8 8 0 0 0-8-8H16a8 8 0 0 0 0 16h24a8 8 0 0 0 8-8Zm192-8h-24a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16Zm-88 88a8 8 0 0 0-8 8v24a8 8 0 0 0 16 0v-24a8 8 0 0 0-8-8Z"/>
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