import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material'
import LetterButton from '../LetterButton'

describe('LetterButton', () => {
  const mockProps = {
    letter: 'A',
    onClick: vi.fn(),
    disabled: false,
    remainingCount: 1
  }

  const theme = createTheme();
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the letter', () => {
    renderWithTheme(<LetterButton {...mockProps} />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    renderWithTheme(<LetterButton {...mockProps} />)
    
    const button = screen.getByRole('button')
    await act(async () => {
      await userEvent.click(button)
    })
    
    expect(mockProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    renderWithTheme(<LetterButton {...mockProps} disabled={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not call onClick when disabled', async () => {
    renderWithTheme(<LetterButton {...mockProps} disabled={true} />)
    
    const button = screen.getByRole('button')
    await act(async () => {
      await userEvent.click(button)
    })
    
    expect(mockProps.onClick).not.toHaveBeenCalled()
  })
  
  it('should show remaining count indicator for counts > 1', () => {
    renderWithTheme(<LetterButton {...mockProps} remainingCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
  
  it('should not show remaining count indicator for count <= 1', () => {
    renderWithTheme(<LetterButton {...mockProps} remainingCount={1} />)
    
    // A is the letter, but there should not be another '1' for the count
    const elements = screen.getAllByText('A')
    expect(elements.length).toBe(1)
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })
}) 