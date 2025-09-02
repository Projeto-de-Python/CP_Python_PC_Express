import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  Autocomplete,
  TextField,
  Chip,
  Grid,
} from '@mui/material';
import {
  RefreshCw,
  Database,
  Brain,
} from 'lucide-react';
import { insightsAPI, productsAPI } from '../services/api.jsx';
import ErrorBoundary from './common/ErrorBoundary';

// Lazy load chart components
const SalesTrendChart = lazy(() => import('./ChartComponents').then(module => ({ default: module.SalesTrendChart })));
const DemandForecastChart = lazy(() => import('./ChartComponents').then(module => ({ default: module.DemandForecastChart })));
const PriceAnalysisChart = lazy(() => import('./ChartComponents').then(module => ({ default: module.PriceAnalysisChart })));
const StockPredictionChart = lazy(() => import('./ChartComponents').then(module => ({ default: module.StockPredictionChart })));

// Loading component for charts
const ChartLoading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height={300}>
    <CircularProgress />
  </Box>
);

export default function Insights() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [generatingData, setGeneratingData] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Multi-product ML analysis
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [multiProductAnalysis, setMultiProductAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchAvailableProducts();
  }, []);

  const fetchData = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const overviewResponse = await insightsAPI.getOverview();
      setOverview(overviewResponse.data);
      
    } catch (error) {
      if (error.response?.status === 401 && retryCount === 0) {
        setTimeout(() => fetchData(retryCount + 1), 2000);
        return;
      }
      
      setError(`Failed to load insights data: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setAvailableProducts(response.data);
    } catch {
      // Failed to fetch products
    }
  };

  const generateSalesData = async (days = 30) => {
    try {
      setGeneratingData(true);
      const response = await insightsAPI.generateSalesData(days);
      alert(response.data.message);
      fetchData();
      fetchAvailableProducts();
    } catch (error) {
      alert(`Failed to generate sales data: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
    } finally {
      setGeneratingData(false);
    }
  };

  const fetchMultiProductAnalysis = async (retryCount = 0) => {
    if (selectedProducts.length === 0) return;
    
    try {
      setAnalysisLoading(true);
      const productIds = selectedProducts.map(p => p.id).join(',');
      const response = await insightsAPI.getMultiProductAnalysis(productIds);
      setMultiProductAnalysis(response.data);
    } catch (error) {
      if (error.response?.status === 401 && retryCount === 0) {
        setTimeout(() => fetchMultiProductAnalysis(retryCount + 1), 2000);
        return;
      }
      
      alert(`Failed to analyze products: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleProductSelection = (event, newValue) => {
    if (newValue && !selectedProducts.find(p => p.id === newValue.id)) {
      setSelectedProducts([...selectedProducts, newValue]);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Chart wrapper components
  const SalesTrendChartWrapper = ({ data, title }) => (
    <Suspense fallback={<ChartLoading />}>
      <ErrorBoundary>
        <SalesTrendChart data={data} title={title} />
      </ErrorBoundary>
    </Suspense>
  );

  const DemandForecastChartWrapper = ({ data, title }) => (
    <Suspense fallback={<ChartLoading />}>
      <ErrorBoundary>
        <DemandForecastChart data={data} title={title} />
      </ErrorBoundary>
    </Suspense>
  );

  const PriceAnalysisChartWrapper = ({ data, title }) => (
    <Suspense fallback={<ChartLoading />}>
      <ErrorBoundary>
        <PriceAnalysisChart data={data} title={title} />
      </ErrorBoundary>
    </Suspense>
  );

  const StockPredictionChartWrapper = ({ data, title }) => (
    <Suspense fallback={<ChartLoading />}>
      <ErrorBoundary>
        <StockPredictionChart data={data} title={title} />
      </ErrorBoundary>
    </Suspense>
  );

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
        <Button
          variant="outlined"
          startIcon={<RefreshCw />}
          onClick={fetchData}
          disabled={loading}
        >
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
            Generate initial sales data to test ML features. This will only create data if no sales exist.
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
          <Tab label="📊 Multi-Product Analysis" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === 0 && overview && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  📦 Inventory Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">
                      <strong>Total Products:</strong> {overview.inventory_summary.total_products}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">
                      <strong>Total Value:</strong> R$ {overview.inventory_summary.total_stock_value?.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">
                      <strong>Low Stock:</strong> {overview.inventory_summary.low_stock_count}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">
                      <strong>Out of Stock:</strong> {overview.inventory_summary.out_of_stock_count}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  💰 Sales Analysis (30 days)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <Typography variant="body2">
                      <strong>Total Sales:</strong> {overview.sales_analysis.total_sales}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="body2">
                      <strong>Total Value:</strong> R$ {overview.sales_analysis.total_sales_value?.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="body2">
                      <strong>Avg Sale:</strong> R$ {overview.sales_analysis.average_sale_value?.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  💡 Recommendations
                </Typography>
                {overview.recommendations?.map((rec, index) => (
                  <Alert key={index} severity={rec.priority === 'high' ? 'warning' : 'info'} sx={{ mb: 1 }}>
                    <Typography variant="body2">{rec.message}</Typography>
                    <Typography variant="caption" display="block">{rec.action}</Typography>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Multi-Product Analysis Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" mb={2}>
            📊 Multi-Product ML Analysis
          </Typography>
          
          {/* Product Selection */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                🎯 Select Products for Analysis
              </Typography>
              
              <Autocomplete
                options={availableProducts}
                getOptionLabel={(option) => `${option.nome} (${option.codigo})`}
                onChange={handleProductSelection}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Product"
                    placeholder="Search and select products..."
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.nome}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {option.codigo} | {option.categoria} | Stock: {option.quantidade} | R$ {option.preco}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
              
              {/* Selected Products */}
              {selectedProducts.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" mb={1}>
                    Selected Products ({selectedProducts.length}):
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {selectedProducts.map((product) => (
                      <Chip
                        key={product.id}
                        label={`${product.nome} (${product.codigo})`}
                        onDelete={() => removeProduct(product.id)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  
                  <Button
                    variant="contained"
                    startIcon={<Brain />}
                    onClick={fetchMultiProductAnalysis}
                    disabled={analysisLoading}
                  >
                    {analysisLoading ? 'Analyzing...' : 'Analyze Selected Products'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Analysis Results */}
          {multiProductAnalysis && (
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" mb={2}>
                    📈 Analysis Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        <strong>Total Products:</strong> {multiProductAnalysis.total_products}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        <strong>Successfully Analyzed:</strong> {multiProductAnalysis.products_analyzed}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        <strong>With Errors:</strong> {multiProductAnalysis.products_with_errors}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              {/* Product Results */}
              {Object.entries(multiProductAnalysis.results).map(([productId, result]) => (
                <Card key={productId} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">
                        📦 {result.product.nome} - {result.product.codigo}
                      </Typography>
                      <Chip
                        label={result.error ? 'Error' : 'Success'}
                        color={result.error ? 'error' : 'success'}
                        size="small"
                      />
                    </Box>
                    
                    {result.error ? (
                      <Alert severity="error">
                        <Typography variant="body2">{result.error}</Typography>
                      </Alert>
                    ) : (
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <SalesTrendChartWrapper
                            data={result.visualizations?.sales_trend}
                            title="Sales Trend"
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <DemandForecastChartWrapper
                            data={result.visualizations?.demand_forecast}
                            title="Demand Forecast"
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <PriceAnalysisChartWrapper
                            data={result.visualizations?.price_analysis}
                            title="Price Analysis"
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <StockPredictionChartWrapper
                            data={result.visualizations?.stock_prediction}
                            title="Stock Prediction"
                          />
                        </Grid>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}