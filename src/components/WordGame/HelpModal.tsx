import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  const rules = [
    'Form words using the letters from the base word',
    'Each word must be at least 3 letters long',
    'You can use each letter only once per word',
    'All words must be valid English words',
    'Score points based on the length of each word you find',
    'Find all possible words to complete the level'
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          How to Play
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          Welcome to Word Game! Create as many words as you can using letters from the main word.
        </Typography>
        
        <List>
          {rules.map((rule, index) => (
            <ListItem key={index}>
              <ListItemText primary={rule} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

export default HelpModal 