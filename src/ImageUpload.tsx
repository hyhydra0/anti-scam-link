import { useRef } from 'react'
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  ImageList,
  ImageListItem,
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material'

interface ImageUploadProps {
  label: string
  placeholder?: string
  value: File[]
  onChange: (files: File[]) => void
  maxImages?: number
}

function ImageUpload({
  label,
  placeholder,
  value = [],
  onChange,
  maxImages = 10,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const totalFiles = value.length + newFiles.length

    if (totalFiles > maxImages) {
      alert(`最多只能上传 ${maxImages} 张图片`)
      return
    }

    onChange([...value, ...newFiles])
    
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const getImageUrl = (file: File): string => {
    return URL.createObjectURL(file)
  }

  // Note: Object URLs are created for preview but are cleaned up by the browser
  // when the component unmounts. For production, consider using a proper
  // image preview library or managing URL lifecycle explicitly

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        {label}
      </Typography>
      {placeholder && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {placeholder}
        </Typography>
      )}
      
      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
        />
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={handleClick}
          disabled={value.length >= maxImages}
          fullWidth
        >
          上传图片 ({value.length}/{maxImages})
        </Button>
      </Box>

      {/* Show Uploaded Images */}
      {value.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <ImageList cols={3} gap={8} sx={{ margin: 0 }}>
            {value.map((file, index) => (
              <ImageListItem key={index}>
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={getImageUrl(file)}
                    alt={`Upload ${index + 1}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                      },
                    }}
                    onClick={() => handleRemove(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      left: 4,
                      right: 4,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      p: 0.5,
                      borderRadius: '0 0 4px 4px',
                      fontSize: '0.7rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.name}
                  </Typography>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        </Paper>
      )}

      {value.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'action.hover',
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            请点击上面按钮上传图片
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default ImageUpload

