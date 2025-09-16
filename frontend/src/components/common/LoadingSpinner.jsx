import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';
import { chartColors } from '../../utils/chartUtils';

export const LoadingSpinner = ({
  message = 'Loading...',
  size = 60,
  minHeight = '400px',
  showMessage = true,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={minHeight}
      gap={2}
    >
      <CircularProgress
        size={size}
        sx={{
          color: chartColors.primary,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      {showMessage && (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{
            mt: 2,
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.number,
  minHeight: PropTypes.string,
  showMessage: PropTypes.bool,
};
