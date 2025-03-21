import { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { LEVELS } from '../../data/levels'
import { Level } from '../../types'
import { ValidationModal } from '../ValidationModal'
import { Link } from 'react-router-dom'

const ADMIN_PASSWORD = '1112'

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [levels, setLevels] = useState<Level[]>([])
  const [editingLevel, setEditingLevel] = useState<Level | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [tempLevel, setTempLevel] = useState<Level>({
    index: 0,
    baseWord: '',
    subWords: []
  })

  useEffect(() => {
    setLevels(LEVELS)
  }, [])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleEditLevel = (level: Level) => {
    setEditingLevel(level)
    setTempLevel({ ...level })
    setIsDialogOpen(true)
  }

  const handleDeleteLevel = (index: number) => {
    setLevels((prev: Level[]) => prev.filter(level => level.index !== index))
  }

  const handleAddLevel = () => {
    const newIndex = Math.max(...levels.map(l => l.index)) + 1
    setEditingLevel(null)
    setTempLevel({
      index: newIndex,
      baseWord: '',
      subWords: []
    })
    setIsDialogOpen(true)
  }

  const handleSaveLevel = () => {
    if (editingLevel) {
      setLevels((prev: Level[]) => 
        prev.map(level => 
          level.index === editingLevel.index ? tempLevel : level
        )
      )
    } else {
      setLevels((prev: Level[]) => [...prev, tempLevel])
    }
    setIsDialogOpen(false)
    setEditingLevel(null)
  }

  const handleSubWordsChange = (value: string) => {
    setTempLevel((prev: Level) => ({
      ...prev,
      subWords: value.split(',').map(word => word.trim().toUpperCase())
    }))
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4, minWidth: '120px' }}
          >
            Back to Game
          </Button>
          <Typography variant="h4" gutterBottom>
            Admin Access
          </Typography>
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
            autoFocus
            sx={{ mb: 2, width: '100%' }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Button 
            variant="contained" 
            onClick={handleLogin}
            sx={{ width: '100%' }}
          >
            Login
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ minWidth: '120px' }}
            >
              Back to Game
            </Button>
            <Typography variant="h4">
              Level Administration
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="info"
              onClick={() => setShowValidation(true)}
              startIcon={<AddIcon />}
            >
              Validate Levels
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddLevel}
            >
              Add Level
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Level</TableCell>
                <TableCell>Base Word</TableCell>
                <TableCell>Sub Words</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {levels.map((level) => (
                <TableRow key={level.index}>
                  <TableCell>{level.index}</TableCell>
                  <TableCell>{level.baseWord}</TableCell>
                  <TableCell>{level.subWords.join(', ')}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditLevel(level)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteLevel(level.index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>
            {editingLevel ? 'Edit Level' : 'Add New Level'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Base Word"
              value={tempLevel.baseWord}
              onChange={(e) => setTempLevel((prev: Level) => ({ ...prev, baseWord: e.target.value.toUpperCase() }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Sub Words (comma-separated)"
              value={tempLevel.subWords.join(', ')}
              onChange={(e) => handleSubWordsChange(e.target.value)}
              fullWidth
              helperText="Enter words separated by commas"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLevel} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <ValidationModal 
          open={showValidation} 
          onClose={() => setShowValidation(false)} 
        />
      </Box>
    </Container>
  )
} 