import React from 'react';
import { Button, Grid } from '@mui/material';

const FormButtons = ({ 
  onReset, 
  onSubmit, 
  resetLabel = "Reset", 
  submitLabel = "Submit",
  resetColor = "error",
  submitColor = "primary"
}) => {
  return (
    <Grid container spacing={2}  style={{ marginTop: 20 }}>
      <Grid item 
       sx={{
        display : 'flex',
        width : '100%',
        flexDirection : 'row',
        
      }}>

        <Button 
          variant="outlined"
          onClick={onReset}
          color={resetColor}
          sx={{
            flexDirection : 'row',
          
            '&:hover': {
              backgroundColor: 'red', 
              color: 'white'
            },
          }}
        >
          {resetLabel}
        </Button>
      </Grid>
      <Grid item>
        <Button 
          type="submit" 
          variant="contained" 
          color={submitColor}
          sx={{
            '&:hover': {
              backgroundColor: 'darkgreen', 
            },
          }}
        >
          {submitLabel}
        </Button>
      </Grid>
    </Grid>
  );
};

export default FormButtons;