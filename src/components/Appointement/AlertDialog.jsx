import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const AlertDialog = ({ 
  open,
  onClose,
  type = 'success', // 'success' or 'warning'
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  showCancelButton = false
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '20px',
          backgroundColor: '#f0f4f8',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box textAlign="center">
        {type === 'success' ? (
          <CheckCircleIcon 
            sx={{
              fontSize: '64px',
              color: '#4caf50',
              marginBottom: '10px',
            }}
          />
        ) : (
          <WarningIcon
            sx={{
              fontSize: '64px',
              color: '#ff9800',
              marginBottom: '10px',
            }}
          />
        )}
      </Box>
      
      <DialogTitle
        sx={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: type === 'success' ? '#2c3e50' : '#d32f2f',
          textAlign: 'center',
        }}
      >
        {title}
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText
          sx={{
            fontSize: '18px',
            color: '#34495e',
            textAlign: 'center',
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center' }}>
        {showCancelButton && (
          <Button 
            onClick={onClose}
            sx={{
              backgroundColor: '#f5f5f5',
              color: '#333',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '16px',
              textTransform: 'none',
              mr: 2,
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            {cancelText}
          </Button>
        )}
        
        <Button 
          onClick={onConfirm || onClose}
          sx={{
            backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
            color: '#fff',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '16px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: type === 'success' ? '#388e3c' : '#d32f2f',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
