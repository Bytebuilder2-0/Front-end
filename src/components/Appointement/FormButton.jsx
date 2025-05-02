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
    <Grid container spacing={3}  style={{ marginTop: 20  }}>

      <Grid item 
       sx={{
        width : '50%',}}>
        <Button 
          variant="outlined"
          onClick={onReset}
          color={resetColor}
          sx={{
            width : '100%',                
            '&:hover': {
              backgroundColor: 'red', 
              color: 'white'
            },
          }}>
          {resetLabel}
        </Button>
      </Grid>

      
      <Grid item
       sx={{
        width : '50%'}}>
     
        <Button 
          type="submit" 
          variant="contained" 
          color={submitColor}
          sx={{
            width : '100%',
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