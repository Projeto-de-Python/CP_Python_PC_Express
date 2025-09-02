import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Alert } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card>
          <CardContent>
            <Typography variant="h6">Error</Typography>
            <Alert severity="error">
              Something went wrong. Please try refreshing the page.
            </Alert>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

export default ErrorBoundary;
