import { Box, Modal, Typography, List, ListItem, ListItemText, Chip } from '@mui/material'
import { WordDefinition } from './types'

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 600,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
}

interface DefinitionsModalProps {
  open: boolean;
  onClose: () => void;
  guessedWords: string[];
  selectedWord: string;
  onWordSelect: (word: string) => void;
  definitions: WordDefinition[];
  isLoadingDefinitions: boolean;
}

const DefinitionsModal: React.FC<DefinitionsModalProps> = ({
  open,
  onClose,
  guessedWords,
  selectedWord,
  onWordSelect,
  definitions,
  isLoadingDefinitions
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="definitions-modal-title"
    >
      <Box sx={modalStyle}>
        <Typography id="definitions-modal-title" variant="h6" component="h2" gutterBottom>
          Word Definitions
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {guessedWords.map((word) => (
            <Chip
              key={word}
              label={word}
              onClick={() => onWordSelect(word)}
              color={selectedWord === word ? 'primary' : 'default'}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>

        {selectedWord && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedWord}
            </Typography>
            {isLoadingDefinitions ? (
              <Typography>Loading definition...</Typography>
            ) : (
              <List>
                {definitions
                  .find(d => d.word === selectedWord)
                  ?.definitions.map((def, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            • {def}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  )
}

export default DefinitionsModal 