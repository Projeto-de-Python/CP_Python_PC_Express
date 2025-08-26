import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
  LinearProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Zap,
  AlertTriangle,
  DollarSign,
  Clock,
  Target,
  BarChart3,
  Brain,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  HelpCircle,
  Database,
  BarChart,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ShoppingCart,
  Percent,
} from 'lucide-react';
import { insightsAPI } from '../services/api.jsx';

export default function Insights({ darkMode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [lowStockAlerts, setLowStockAlerts] = useState(null);
  const [generatingData, setGeneratingData] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productInsights, setProductInsights] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch overview insights
      const overviewResponse = await insightsAPI.getOverview();
      setOverview(overviewResponse.data);
      
      // Fetch low stock alerts
      const alertsResponse = await insightsAPI.getLowStockAlerts();
      setLowStockAlerts(alertsResponse.data);
      
    } catch (err) {
      console.error('Error fetching insights data:', err);
      setError('Failed to load insights data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSalesData = async (days = 30) => {
    try {
      setGeneratingData(true);
      const response = await insightsAPI.generateSalesData(days);
      setError(null);
      await fetchData(); // Refresh data after generating sales
      
      // Show success message
      alert(`✅ Generated ${response.data.sales_count} sales over the past ${days} days!`);
    } catch (err) {
      setError('Failed to generate sales data');
    } finally {
      setGeneratingData(false);
    }
  };

  const getProductInsights = async (productId) => {
    try {
      const response = await insightsAPI.getProductInsights(productId);
      setProductInsights(response.data);
      setSelectedProduct(productId);
    } catch (err) {
      console.error('Error fetching product insights:', err);
      setError('Failed to load product insights');
    }
  };

  const getStockHealthColor = (health) => {
    switch (health) {
      case 'healthy': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'error';
      default: return 'default';
    }
  };

  const getStockHealthIcon = (health) => {
    switch (health) {
      case 'healthy': return <CheckCircle size={16} />;
      case 'low_stock': return <AlertTriangle size={16} />;
      case 'out_of_stock': return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" sx={{ 
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {t('insights.title')}
        </Typography>
        <Box display="flex" gap={2}>
          <Tooltip title="Generate Sample Sales Data">
            <Button
              variant="outlined"
              startIcon={<Database />}
              onClick={generateSalesData}
              disabled={generatingData}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': { borderColor: '#5a6fd8', backgroundColor: 'rgba(102,126,234,0.1)' }
              }}
            >
              {generatingData ? t('common.loading') : t('insights.generateData')}
            </Button>
          </Tooltip>
          <Tooltip title="Refresh Insights">
            <IconButton onClick={fetchData} sx={{ 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              '&:hover': { background: 'linear-gradient(45deg, #5a6fd8, #6a4c93)' }
            }}>
              <RefreshCw size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Overview Cards */}
      {overview && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
                : 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(102,126,234,0.2)',
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {overview.inventory_summary?.total_products || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                      {t('insights.totalProducts')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                    }}
                  >
                    <Package size={24} color="#667eea" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
                : 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(102,126,234,0.2)',
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      ${overview.inventory_summary?.total_stock_value?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                      {t('insights.stockValue')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'rgba(46, 125, 50, 0.1)',
                      border: '1px solid rgba(46, 125, 50, 0.3)',
                    }}
                  >
                    <DollarSign size={24} color="#2e7d32" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
                : 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(102,126,234,0.2)',
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {overview.inventory_summary?.low_stock_count || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                      Low Stock Items
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'rgba(237, 108, 2, 0.1)',
                      border: '1px solid rgba(237, 108, 2, 0.3)',
                    }}
                  >
                    <AlertTriangle size={24} color="#ed6c02" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
                : 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(102,126,234,0.2)',
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {overview.sales_analysis?.total_sales || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                      Recent Sales
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'rgba(2, 136, 209, 0.1)',
                      border: '1px solid rgba(2, 136, 209, 0.3)',
                    }}
                  >
                    <ShoppingCart size={24} color="#0288d1" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Recommendations */}
      {overview?.recommendations?.length > 0 && (
        <Card sx={{ mb: 3, 
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
            : 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
          border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(102,126,234,0.2)',
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Brain size={24} color="#667eea" />
              <Typography variant="h6" fontWeight="600" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                Business Recommendations
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {overview.recommendations.map((rec, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid',
                    borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(102,126,234,0.2)',
                    background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                  }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Chip 
                        label={rec.priority} 
                        size="small" 
                        color={rec.priority === 'high' ? 'error' : 'warning'}
                      />
                      <Typography variant="body2" fontWeight="600" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        {rec.type}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                      {rec.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>
                      {rec.action}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Alerts */}
      {lowStockAlerts?.low_stock_products?.length > 0 && (
        <Card sx={{ 
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
            : 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
          border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(102,126,234,0.2)',
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="600" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                Low Stock Alerts
              </Typography>
              <Tooltip title="Products that need attention due to low stock levels">
                <IconButton size="small" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                  <HelpCircle size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            
            <TableContainer component={Paper} sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
            }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Current Stock</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Daily Demand</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Days Until Stockout</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Priority</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockAlerts.low_stock_products.map((item) => (
                    <TableRow
                      key={item.product.id}
                      sx={{
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                        '&:hover': {
                          background: darkMode 
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 100%)'
                            : 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                            {item.product.nome}
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                            {item.product.codigo} • {item.product.categoria}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                          {item.product.quantidade}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                          {item.analysis.avg_daily_demand.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" color="error.main">
                          {item.analysis.days_until_stockout === Infinity ? 'N/A' : item.analysis.days_until_stockout.toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.analysis.urgency.charAt(0).toUpperCase() + item.analysis.urgency.slice(1)}
                          color={item.analysis.urgency === 'critical' ? 'error' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => getProductInsights(item.product.id)}
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': { 
                              borderColor: '#5a6fd8',
                              backgroundColor: 'rgba(102,126,234,0.1)'
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Product Insights Dialog */}
      <Dialog 
        open={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <BarChart3 size={20} />
            <Typography variant="h6">Product Insights</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {productInsights && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {productInsights.product.nome}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {productInsights.product.codigo} • {productInsights.product.categoria}
                    </Typography>
                    <Box display="flex" gap={2} mt={1}>
                      <Chip
                        label={`Stock: ${productInsights.product.quantidade}`}
                        color={getStockHealthColor(productInsights.product.stock_health)}
                        icon={getStockHealthIcon(productInsights.product.stock_health)}
                      />
                      <Chip
                        label={`Price: $${productInsights.product.preco}`}
                        color="primary"
                      />
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Sales Analysis (30 days)</Typography>
                    <Box>
                      <Typography variant="body2">
                        <strong>Total Sold:</strong> {productInsights.sales_analysis.total_sold_30d}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Sales Value:</strong> ${productInsights.sales_analysis.total_sales_value_30d.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Average Sale:</strong> {productInsights.sales_analysis.average_sale_quantity.toFixed(1)} units
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Stock Movements (30 days)</Typography>
                    <Box>
                      <Typography variant="body2">
                        <strong>Stock In:</strong> {productInsights.movement_analysis.total_in_30d}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Stock Out:</strong> {productInsights.movement_analysis.total_out_30d}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Net Movement:</strong> {productInsights.movement_analysis.net_movement}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                {productInsights.recommendations?.length > 0 && (
                  <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>Recommendations</Typography>
                      {productInsights.recommendations.map((rec, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, borderRadius: 1, bgcolor: 'rgba(102,126,234,0.1)' }}>
                          <Typography variant="body2" fontWeight="600">
                            {rec.message}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {rec.action}
                          </Typography>
                        </Box>
                      ))}
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProduct(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
