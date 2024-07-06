import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex' , position: "relative" ,top: "11rem",  marginLeft: "50rem" ,
      '& .MuiCircularProgress-root': {
      width : '8rem',
      height : "6rem"
    },
      }}>
      <CircularProgress size={"8rem"} />
    </Box>
  );
}