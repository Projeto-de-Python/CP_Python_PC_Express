import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { alertsAPI } from '../services/api';

export default function Alerts() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLowStockAlerts();
    
    // Listen for product data changes from other components
    const handleProductsDataChanged = (event) => {
      console.log('Alerts: Products data changed:', event.detail);
      // Refresh alerts data to stay synchronized
      fetchLowStockAlerts();
    };
    
    window.addEventListener('productsDataChanged', handleProductsDataChanged);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('productsDataChanged', handleProductsDataChanged);
    };
  }, []);

  const fetchLowStockAlerts = async () => {
    try {
      const response = await alertsAPI.getLowStock();
      setLowStockProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load low stock alerts');
      setLoading(false);
    }
  };

  const getStockStatusColor = (product) => {
    if (product.quantidade === 0) return 'error';
    if (product.quantidade <= product.estoque_minimo / 2) return 'error';
    return 'warning';
  };

  const getStockStatusText = (product) => {
    if (product.quantidade === 0) return 'Out of Stock';
    if (product.quantidade <= product.estoque_minimo / 2) return 'Critical';
    return 'Low Stock';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
          <Typography variant="h4">Low Stock Alerts</Typography>
          <IconButton
            size="small"
            title="Monitor products that are running low on stock. Critical alerts indicate items that need immediate attention. Use this section to identify which products need restocking."
            sx={{ color: 'rgba(255, 152, 0, 0.8)' }}
          >
            <HelpIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {lowStockProducts.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <InventoryIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="success.main">
                No Low Stock Alerts
              </Typography>
              <Typography variant="body2" color="textSecondary">
                All products are above their minimum stock levels.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Alerts
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {lowStockProducts.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Critical Items
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {lowStockProducts.filter(p => p.quantidade <= p.estoque_minimo / 2).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Out of Stock
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {lowStockProducts.filter(p => p.quantidade === 0).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Alerts Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Minimum Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Typography variant="subtitle1">{product.nome}</Typography>
                      {product.descricao && (
                        <Typography variant="body2" color="textSecondary">
                          {product.descricao}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{product.codigo}</TableCell>
                    <TableCell>{product.categoria}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.quantidade}
                        color={getStockStatusColor(product)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{product.estoque_minimo}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStockStatusText(product)}
                        color={getStockStatusColor(product)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>${product.preco}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Action Buttons */}
          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.href = '/products'}
            >
              Manage Products
            </Button>
            <Button
              variant="outlined"
              onClick={fetchLowStockAlerts}
            >
              Refresh Alerts
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
