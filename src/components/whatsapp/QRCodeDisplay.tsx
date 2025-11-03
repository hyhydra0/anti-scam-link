import { Box, Button, CircularProgress, Typography } from '@mui/material'

interface QRCodeDisplayProps {
  loading: boolean
  qrCode: string
  error: string
  regenerateText: string
  onRegenerate: () => void
}

export default function QRCodeDisplay({ loading, qrCode, error, regenerateText, onRegenerate }: QRCodeDisplayProps) {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={40} sx={{ color: '#00a884' }} />
          <Box sx={{ color: '#667781', fontSize: '14px' }}>Generating QR Code...</Box>
        </Box>
      )}

      {qrCode && !error && !loading && (
        <Box
          sx={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            padding: '24px',
            maxWidth: '264px'
          }}
        >
          <Box component="img" src={qrCode} alt="QR Code" sx={{ width: '100%', maxWidth: '264px', height: 'auto', display: 'block' }} />
        </Box>
      )}

      {error && (
        <Box sx={{ textAlign: 'center', color: '#667781', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography>{error}</Typography>
          <Button
            variant="contained"
            onClick={onRegenerate}
            sx={{
              background: '#00a884',
              color: 'white',
              '&:hover': {
                background: '#008f6f'
              }
            }}
          >
            {regenerateText}
          </Button>
        </Box>
      )}
    </Box>
  )
}

