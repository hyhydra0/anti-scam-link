import { useState } from 'react'
import { Button, Box, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

interface PairingCodeDisplayProps {
  code: string
  copyText?: string
  copiedText?: string
}

export default function PairingCodeDisplay({ code, copyText = 'Copy Code', copiedText = 'Copied!' }: PairingCodeDisplayProps) {
  const [isCopied, setIsCopied] = useState(false)

  // Ensure code is a string and split it
  const codeArray = code && typeof code === 'string' ? code.split('') : []

  const copyCode = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      // Silent fail
    }
  }

  // Don't render if code is empty
  if (!code || codeArray.length === 0) {
    return null
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          margin: '10px 0',
          flexWrap: 'nowrap',
          padding: '20px 10px',
          background: '#f7f8fa',
          borderRadius: '12px',
          width: '100%',
          overflowX: 'auto'
        }}
      >
        {codeArray.map((char, index) => (
          <Box
            key={index}
            sx={{
              width: '44px',
              height: '50px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: 600,
              color: '#111b21',
              background: '#fff',
              border: index === 4 ? 'none' : '1px solid rgb(99, 97, 97)',
              borderRadius: '8px',
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              letterSpacing: 0,
              ...(index === 4 && {
                background: 'transparent',
                fontWeight: 400,
                color: '#000',
                width: '20px'
              })
            }}
          >
            {char}
          </Box>
        ))}
      </Box>
      <Button
        variant="contained"
        onClick={copyCode}
        startIcon={<ContentCopyIcon />}
        sx={{
          marginTop: '20px',
          padding: '12px 24px',
          background: '#1daa61',
          color: 'white',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: 500,
          '&:hover': {
            background: '#06cf9c'
          },
          '&:active': {
            background: '#008f6f'
          }
        }}
      >
        {isCopied ? copiedText : copyText}
      </Button>
    </Box>
  )
}

