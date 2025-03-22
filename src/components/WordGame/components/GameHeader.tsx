import { Box, Typography, IconButton } from '@mui/material'
import { FaQuestionCircle } from 'react-icons/fa'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { GiLightBulb } from 'react-icons/gi'
import { WiDaySunny } from 'react-icons/wi'
import { WiMoonAltWaningCrescent4 } from 'react-icons/wi'
import { LEVELS } from '../../../data/levels'
import { Level } from '../types'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation();
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
        {t('level')} {levelIndex}
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
          {t('score')}
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
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton
          onClick={onHelpClick}
          color="primary"
          size="medium"
          aria-label="help"
          sx={{ 
            color: '#4e7ac7',
            '&:hover': {
              color: '#3f51b5',
            }
          }}
        >
          <FaQuestionCircle size={24} />
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
              transform: 'rotate(12deg) scale(1.05)'
            }
          }}
        >
          {isDarkMode ? (
            <WiDaySunny size={30} style={{ filter: 'drop-shadow(0 0 4px rgba(253, 216, 53, 0.6))' }} />
          ) : (
            <WiMoonAltWaningCrescent4 size={30} style={{ filter: 'drop-shadow(0 0 4px rgba(92, 107, 192, 0.6))' }} />
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
              transform: 'scale(1.05)'
            }
          }}
        >
          <GiLightBulb size={24} />
        </IconButton>
        <IconButton
          onClick={onMenuOpen}
          color="inherit"
          size="medium"
          aria-label="menu"
        >
          <BsThreeDotsVertical size={22} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default GameHeader 