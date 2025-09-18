import { ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from '@mui/material';
import {
    Brain,
    Database,
    DollarSign,
    Package,
    RefreshCw,
    TrendingUp,
    AlertTriangle as Warning
} from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { insightsAPI } from '../services/api.jsx';

export default function Insights() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [lowStockAlerts, setLowStockAlerts] = useState(null);
  const [generatingData, setGeneratingData] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productInsights] = useState(null);
  const [mlInsights, setMlInsights] = useState({});
  const [selectedProductForML, setSelectedProductForML] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [mlLoading, setMlLoading] = useState(false);

  useEffect(() => {
    fetchData();

    // Listen for product selection from Products component
    const handleProductSelectedForML = event => {
      const { product } = event.detail;
      setSelectedProductForML(product);
      fetchMLInsights(product.id);
    };

    window.addEventListener('productSelectedForML', handleProductSelectedForML);

    // Cleanup event listener
    return () => {
      window.removeEventListener('productSelectedForML', handleProductSelectedForML);
    };
  }, []);

  const fetchData = async() => {
    try {
      setLoading(true);
      setError(null);

      // Fetch overview insights
      const overviewResponse = await insightsAPI.getOverview();
      setOverview(overviewResponse.data);

      // Temporarily skip low stock alerts due to backend issue
      setLowStockAlerts({
        low_stock_products: [],
        total_low_stock: 0,
        critical_count: 0,
        high_count: 0
      });
    } catch (error) {
      setError(
        `Failed to load insights data: ${error.response?.data?.detail || error.message || 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const generateSalesData = async(days = 30) => {
    try {
      setGeneratingData(true);
      const response = await insightsAPI.generateSalesData(days);
      // Sales data generated successfully
      fetchData(); // Refresh data
    } catch (error) {
      // Error generating sales data
      setError(
        `Failed to generate sales data: ${error.response?.data?.detail || error.message || 'Unknown error'}`
      );
    } finally {
      setGeneratingData(false);
    }
  };

  const fetchMLInsights = async productId => {
    try {
      setMlLoading(true);
      const response = await insightsAPI.getMLProductInsights(productId);
      setMlInsights(prev => ({
        ...prev,
        [productId]: response.data
      }));
    } catch {
      setError('Failed to load ML insights. Please try again.');
    } finally {
      setMlLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // ML Insights Components
  const MLInsightsCard = ({ insights }) => {
    if (!insights) {
return null;
}

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Brain size={20} style={{ marginRight: 8 }} />
            <Typography variant="h6">🤖 Machine Learning Insights</Typography>
          </Box>

          {insights.demand_prediction?.success && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <TrendingUp size={16} style={{ marginRight: 8 }} />
                  <Typography variant="subtitle1">📈 Demand Prediction (30 days)</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Avg Daily Demand:</strong>{' '}
                      {insights.demand_prediction.avg_daily_demand?.toFixed(2)} units
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Total Predicted:</strong>{' '}
                      {insights.demand_prediction.total_predicted_demand?.toFixed(0)} units
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Model Accuracy:</strong>{' '}
                      {(insights.demand_prediction.model_accuracy * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Data Points:</strong>{' '}
                      {insights.demand_prediction.historical_data_points}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {insights.price_optimization?.success && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <DollarSign size={16} style={{ marginRight: 8 }} />
                  <Typography variant="subtitle1">💰 Price Optimization</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Current Price:</strong> R$ {insights.price_optimization.current_price}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Optimal Price:</strong> R$ {insights.price_optimization.optimal_price}
                    </Typography>
                  </Grid>
                  {insights.price_optimization.revenue_increase > 0 && (
                    <Grid size={{ xs: 12 }}>
                      <Alert severity="success">
                        +{insights.price_optimization.revenue_increase}% revenue potential
                      </Alert>
                    </Grid>
                  )}
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Model Accuracy:</strong>{' '}
                      {(insights.price_optimization.model_accuracy * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {insights.stock_optimization?.success && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <Package size={16} style={{ marginRight: 8 }} />
                  <Typography variant="subtitle1">📦 Stock Optimization</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Current Stock:</strong> {insights.stock_optimization.current_stock}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Reorder Point:</strong> {insights.stock_optimization.reorder_point}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Stock Coverage:</strong>{' '}
                      {insights.stock_optimization.stock_cover_days} days
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Optimal Stock:</strong> {insights.stock_optimization.optimal_stock}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {insights.anomaly_detection?.success &&
            insights.anomaly_detection.total_anomalies > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center">
                    <Warning size={16} style={{ marginRight: 8 }} />
                    <Typography variant="subtitle1">⚠️ Anomaly Detection</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    <strong>Anomalies Detected:</strong>{' '}
                    {insights.anomaly_detection.total_anomalies}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Data Points:</strong> {insights.anomaly_detection.data_points}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

          {insights.summary?.recommended_actions?.map((action, index) => (
            <Alert
              key={index}
              severity={action.priority === 'high' ? 'warning' : 'info'}
              sx={{ mb: 1 }}
            >
              <Typography variant="body2">{action.message}</Typography>
              <Typography variant="caption" display="block">
                {action.action}
              </Typography>
            </Alert>
          ))}

          {!insights.summary?.has_sufficient_data && (
            <Alert severity="info">
              <Typography variant="body2">
                Add more sales data to get better ML insights. The system needs at least 14 days of
                sales data.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  MLInsightsCard.propTypes = {
    insights: PropTypes.object.isRequired
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          📊 Insights & Analytics
        </Typography>
        <Button variant="outlined" startIcon={<RefreshCw />} onClick={fetchData} disabled={loading}>
          Refresh
        </Button>
      </Box>

      {/* Generate Data Button */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            🚀 System Setup
          </Typography>
          <Typography variant="body2" mb={2}>
            Generate initial sales data to test ML features. This will only create data if no sales
            exist.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Database />}
            onClick={() => generateSalesData(30)}
            disabled={generatingData}
          >
            {generatingData ? 'Generating...' : 'Generate Initial Data (30 days)'}
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="📈 Overview" />
          <Tab label="🤖 ML Insights" />
          <Tab label="⚠️ Low Stock Alerts" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === 0 && overview && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  📦 Inventory Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Total Products:</strong> {overview.inventory_summary.total_products}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Total Value:</strong> R${' '}
                      {overview.inventory_summary.total_stock_value?.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Low Stock:</strong> {overview.inventory_summary.low_stock_count}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Out of Stock:</strong> {overview.inventory_summary.out_of_stock_count}
                    </Typography>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Typography variant="body2">Stock Health</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={overview.inventory_summary.stock_health_percentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption">
                    {overview.inventory_summary.stock_health_percentage?.toFixed(1)}% healthy
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  💰 Sales Analysis (30 days)
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <Typography variant="body2">
                      <strong>Total Sales:</strong> {overview.sales_analysis.total_sales}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <Typography variant="body2">
                      <strong>Total Value:</strong> R${' '}
                      {overview.sales_analysis.total_sales_value?.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <Typography variant="body2">
                      <strong>Avg Sale:</strong> R${' '}
                      {overview.sales_analysis.average_sale_value?.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  💡 Recommendations
                </Typography>
                {overview.recommendations?.map((rec, index) => (
                  <Alert
                    key={index}
                    severity={rec.priority === 'high' ? 'warning' : 'info'}
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2">{rec.message}</Typography>
                    <Typography variant="caption" display="block">
                      {rec.action}
                    </Typography>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ML Insights Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" mb={2}>
            🤖 Machine Learning Insights
          </Typography>

          {selectedProductForML ? (
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    📦 {selectedProductForML.nome} - {selectedProductForML.codigo}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Category: {selectedProductForML.categoria} | Stock:{' '}
                    {selectedProductForML.quantidade} | Price: R$ {selectedProductForML.preco}
                  </Typography>
                </CardContent>
              </Card>

              {mlLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <MLInsightsCard insights={mlInsights[selectedProductForML.id]} />
              )}
            </Box>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                Select a product from the Products tab to view ML insights. The system will analyze
                real sales data to provide predictions and recommendations.
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {/* Low Stock Alerts Tab */}
      {activeTab === 2 && lowStockAlerts && (
        <Box>
          <Typography variant="h6" mb={2}>
            ⚠️ Low Stock Alerts
          </Typography>

          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 4, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="error">
                    {lowStockAlerts.total_low_stock}
                  </Typography>
                  <Typography variant="body2">Total Low Stock</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="warning.main">
                    {lowStockAlerts.critical_count}
                  </Typography>
                  <Typography variant="body2">Critical</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="info.main">
                    {lowStockAlerts.high_count}
                  </Typography>
                  <Typography variant="body2">High Priority</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Min Stock</TableCell>
                  <TableCell>Urgency</TableCell>
                  <TableCell>Days Until Stockout</TableCell>
                  <TableCell>Recommended Restock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockAlerts.low_stock_products?.map(item => (
                  <TableRow key={item.product.id}>
                    <TableCell>{item.product.nome}</TableCell>
                    <TableCell>{item.product.codigo}</TableCell>
                    <TableCell>{item.product.quantidade}</TableCell>
                    <TableCell>{item.product.estoque_minimo}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.analysis.urgency}
                        color={
                          item.analysis.urgency === 'critical'
                            ? 'error'
                            : item.analysis.urgency === 'high'
                              ? 'warning'
                              : 'info'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {item.analysis.days_until_stockout === Infinity
                        ? '∞'
                        : item.analysis.days_until_stockout?.toFixed(1)}
                    </TableCell>
                    <TableCell>{item.analysis.recommended_restock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Product Details Dialog */}
      <Dialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>📦 Product Insights: {selectedProduct?.nome}</DialogTitle>
        <DialogContent>
          {productInsights && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Product Information</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, md: 6 }}>
                        <Typography variant="body2">
                          <strong>Code:</strong> {productInsights.product.codigo}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 6 }}>
                        <Typography variant="body2">
                          <strong>Category:</strong> {productInsights.product.categoria}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 6 }}>
                        <Typography variant="body2">
                          <strong>Stock:</strong> {productInsights.product.quantidade}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 6 }}>
                        <Typography variant="body2">
                          <strong>Price:</strong> R$ {productInsights.product.preco}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Sales Analysis (30 days)</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="body2">
                          <strong>Total Sold:</strong>{' '}
                          {productInsights.sales_analysis.total_sold_30d}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="body2">
                          <strong>Sales Value:</strong> R${' '}
                          {productInsights.sales_analysis.total_sales_value_30d?.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="body2">
                          <strong>Avg Sale Qty:</strong>{' '}
                          {productInsights.sales_analysis.average_sale_quantity?.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="body2">
                          <strong>Sales Count:</strong> {productInsights.sales_analysis.sales_count}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Price Analysis</Typography>
                    <Typography variant="body2">
                      <strong>Analysis:</strong> {productInsights.price_analysis.analysis}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Recommendation:</strong>{' '}
                      {productInsights.price_analysis.recommendation}
                    </Typography>
                    {productInsights.price_analysis.avg_sale_price && (
                      <Typography variant="body2">
                        <strong>Avg Sale Price:</strong> R${' '}
                        {productInsights.price_analysis.avg_sale_price?.toFixed(2)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Recommendations</Typography>
                    {productInsights.recommendations?.map((rec, index) => (
                      <Alert
                        key={index}
                        severity={
                          rec.priority === 'critical'
                            ? 'error'
                            : rec.priority === 'high'
                              ? 'warning'
                              : 'info'
                        }
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2">{rec.message}</Typography>
                        <Typography variant="caption" display="block">
                          {rec.action}
                        </Typography>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProduct(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

Insights.propTypes = {};
