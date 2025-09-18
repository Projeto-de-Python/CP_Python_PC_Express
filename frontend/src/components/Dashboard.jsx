import {
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Activity,
  AlertTriangle,
  HelpCircle,
  Package,
  PieChart,
  RotateCcw,
  TrendingUp,
  Users
} from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

import { alertsAPI, productsAPI, salesAPI, suppliersAPI } from '../services/api.jsx';
import { chartColors, formatCurrency } from '../utils/chartUtils';

import { ChartWrapper, ErrorMessage, LoadingSpinner, StatCard } from './common';

export default function Dashboard({ darkMode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchDashboardData = useCallback(async() => {
    // Evita requisições concorrentes
    if (isFetching) {
      return;
    }

    try {
      setIsFetching(true);
      setLoading(true);
      setError(null);

      const [productsRes, suppliersRes, alertsRes, topProductsRes] = await Promise.all([
        productsAPI.getAll(),
        suppliersAPI.getAll(),
        alertsAPI.getLowStock(),
        salesAPI.getTopProducts(5)
      ]);

      setProducts(productsRes.data || []);
      setSuppliers(suppliersRes.data || []);
      setLowStockAlerts(alertsRes.data || []);

      // Set top products from sales data
      if (topProductsRes.data?.top_products) {
        setTopProducts(topProductsRes.data.top_products);
      }
    } catch (error) {
      setError(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [isFetching]); // Adicionado isFetching de volta

  useEffect(() => {
    fetchDashboardData();

    // Listen for product data changes from other components
    const handleProductsDataChanged = () => {
      // Debounce para evitar múltiplas chamadas
      if (!isFetching) {
        fetchDashboardData();
      }
    };

    window.addEventListener('productsDataChanged', handleProductsDataChanged);

    return () => {
      window.removeEventListener('productsDataChanged', handleProductsDataChanged);
    };
  }, [refreshKey]); // Removido isFetching e fetchDashboardData para evitar loop

  // Auto-refresh every 5 minutes (aumentado para reduzir conflitos)
  useEffect(() => {
    const interval = setInterval(() => {
      // Só faz refresh se a página estiver visível e não estiver carregando
      if (!document.hidden && !isFetching) {
        fetchDashboardData();
      }
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [fetchDashboardData, isFetching]); // Adicionado dependências

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(0);
  };

  const handleCategoryClick = category => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleStockClick = data => {
    // Navigate to products page with filter for this product
    navigate('/products', {
      state: {
        filterProduct: data.name,
        highlightStock: true
      }
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  // Calculate stats
  const stats = {
    totalProducts: products.length,
    totalSuppliers: suppliers.length,
    lowStockProducts: products.filter(p => p.em_estoque_baixo).length,
    totalInventoryValue: products.reduce((sum, product) => {
      return sum + product.preco * product.quantidade;
    }, 0)
  };

  // Website Traffic Data
  const websiteTrafficData = [
    {
      metric: t('dashboard.pageViews'),
      value: 20500,
      target: 25000,
      color: chartColors.primary,
      icon: '📊'
    },
    {
      metric: t('dashboard.uniqueVisitors'),
      value: 12450,
      target: 15000,
      color: chartColors.success,
      icon: '👥'
    },
    {
      metric: t('dashboard.avgSessionTime'),
      value: 4.2,
      target: 5.0,
      color: chartColors.warning,
      icon: '⏱️',
      unit: 'min'
    },
    {
      metric: t('dashboard.bounceRate'),
      value: 32.5,
      target: 25.0,
      color: chartColors.error,
      icon: '📉',
      unit: '%'
    }
  ];

  const categoryData =
    products.length > 0
      ? Object.entries(
          products.reduce((acc, product) => {
            acc[product.categoria] = (acc[product.categoria] || 0) + 1;
            return acc;
          }, {})
        ).map(([name, value], index) => ({
          name,
          value,
          color: chartColors.chartColors[index % chartColors.chartColors.length]
        }))
      : [
          { name: 'Processors', value: 5, color: chartColors.chartColors[0] },
          { name: 'Graphics Cards', value: 3, color: chartColors.chartColors[1] },
          { name: 'Memory', value: 4, color: chartColors.chartColors[2] },
          { name: 'Storage', value: 6, color: chartColors.chartColors[3] }
        ];

  // Stock Levels Data
  const stockLevelsData =
    products.length > 0
      ? products.slice(0, 8).map(product => ({
          name: product.nome.length > 15 ? `${product.nome.substring(0, 15)}...` : product.nome,
          current: product.quantidade,
          minimum: product.estoque_minimo,
          color:
            product.quantidade <= product.estoque_minimo ? chartColors.error : chartColors.success
        }))
      : [
          { name: 'AMD Ryzen 7 5800X', current: 15, minimum: 5, color: chartColors.success },
          { name: 'NVIDIA RTX 3080', current: 3, minimum: 5, color: chartColors.error },
          { name: 'Samsung 970 EVO 1TB', current: 25, minimum: 10, color: chartColors.success },
          { name: 'Corsair Vengeance 16GB', current: 8, minimum: 15, color: chartColors.error },
          { name: 'ASUS ROG Strix B550', current: 12, minimum: 8, color: chartColors.success },
          { name: 'Seagate Barracuda 2TB', current: 18, minimum: 12, color: chartColors.success },
          { name: 'EVGA 750W Gold', current: 6, minimum: 10, color: chartColors.error },
          { name: 'Logitech G Pro X', current: 22, minimum: 15, color: chartColors.success }
        ];

  // Top Performing Products Data
  // Top Performing Products Data - Now based on real sales data
  const topProductsData = topProducts.length > 0
    ? topProducts.map((product, index) => ({
        name: product.nome,
        code: product.codigo,
        value: product.total_sales,
        stock: product.current_stock,
        price: product.preco,
        quantitySold: product.total_quantity_sold,
        color: chartColors.chartColors[index % chartColors.chartColors.length]
      }))
    : products.length > 0
      ? products
          .sort((a, b) => b.preco * b.quantidade - a.preco * a.quantidade)
          .slice(0, 5)
          .map((product, index) => ({
            name: product.nome,
            code: product.codigo,
            value: product.preco * product.quantidade,
            stock: product.quantidade,
            price: product.preco,
            quantitySold: 0,
            color: chartColors.chartColors[index % chartColors.chartColors.length]
          }))
      : [
          {
            name: 'AMD Ryzen 7 5800X',
            code: 'PROC-001',
            value: 15999.0,
            stock: 10,
            price: 1599.9,
            quantitySold: 0,
            color: chartColors.chartColors[0]
          },
          {
            name: 'NVIDIA RTX 4060 8GB',
            code: 'GPU-001',
            value: 21999.0,
            stock: 10,
            price: 2199.9,
            quantitySold: 0,
            color: chartColors.chartColors[1]
          },
          {
            name: 'SSD NVMe 1TB Kingston',
            code: 'SSD-001',
            value: 4299.0,
            stock: 10,
            price: 429.9,
            quantitySold: 0,
            color: chartColors.chartColors[2]
          },
          {
            name: 'Monitor 24" 144Hz',
            code: 'MON-001',
            value: 8999.0,
            stock: 10,
            price: 899.9,
            quantitySold: 0,
            color: chartColors.chartColors[3]
          },
          {
            name: 'Teclado Mecânico RGB',
            code: 'KB-001',
            value: 2999.0,
            stock: 10,
            price: 299.9,
            quantitySold: 0,
            color: chartColors.chartColors[4]
          }
        ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="h4"
            fontWeight="bold"
            data-tour="dashboard-title"
            sx={{
              background: chartColors.gradientColors.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('dashboard.title')}
          </Typography>
          <Tooltip title="This dashboard provides real-time insights into your inventory performance, helping you make informed business decisions. Monitor stock levels, track sales trends, and identify opportunities for growth.">
            <IconButton
              sx={{
                color: chartColors.primary,
                '&:hover': {
                  color: chartColors.secondary,
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <HelpCircle size={20} />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title={t('common.loading')}>
          <IconButton
            onClick={handleRefresh}
            sx={{
              background: chartColors.gradientColors.primary,
              color: 'white',
              '&:hover': {
                background: chartColors.gradientColors.secondary,
                transform: 'rotate(180deg)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <RotateCcw size={20} />
          </IconButton>
        </Tooltip>
      </Box>

      <ErrorMessage error={error} onRetry={fetchDashboardData} onClose={() => setError(null)} />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }} data-tour="stats-cards" className="dashboard-kpi-cards">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.totalProducts')}
            value={stats.totalProducts}
            icon={<Package size={24} color="white" />}
            gradient={chartColors.gradientColors.primary}
            trend={12}
            subtitle="Active inventory items"
            route="/products"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.totalSuppliers')}
            value={stats.totalSuppliers}
            icon={<Users size={24} color="white" />}
            gradient={chartColors.gradientColors.secondary}
            trend={5}
            subtitle="Business partners"
            route="/suppliers"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.lowStock')}
            value={stats.lowStockProducts}
            icon={<AlertTriangle size={24} color="white" />}
            gradient={chartColors.gradientColors.warning}
            trend={-8}
            subtitle="Need attention"
            route="/alerts"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Inventory Value"
            value={formatCurrency(stats.totalInventoryValue)}
            icon={<TrendingUp size={24} color="white" />}
            gradient={chartColors.gradientColors.success}
            subtitle="Current stock value"
            route="/insights"
          />
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <ChartWrapper
            title={t('dashboard.websiteTraffic')}
            icon={<Activity size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            darkMode={darkMode}
            tooltip="Monitor website traffic metrics including page views, unique visitors, session time, and bounce rate. Track your digital marketing performance and user engagement."
            expanded={false}
            onToggleExpand={() => {}}
            data-tour="website-traffic"
          >
            <Box sx={{ p: 1 }}>
              <Grid container spacing={1}>
                {websiteTrafficData.map((item) => (
                  <Grid size={{ xs: 6 }} key={`traffic-${item.metric}`}>
                    <Card
                      sx={{
                        p: 1.5,
                        background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`,
                        border: `1px solid ${item.color}30`,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        minHeight: '120px',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 20px ${item.color}20`
                        }
                      }}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                        <Typography variant="h6" sx={{ color: item.color, fontSize: '1.2rem' }}>
                          {item.icon}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', fontSize: '0.7rem' }}
                        >
                          {item.metric}
                        </Typography>
                      </Box>

                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ color: darkMode ? '#ffffff' : '#000000', mb: 0.3, fontSize: '1.4rem' }}
                      >
                        {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
                        {item.unit || ''}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography
                          variant="caption"
                          sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', fontSize: '0.7rem' }}
                        >
                          Target:{' '}
                          {item.target >= 1000
                            ? `${(item.target / 1000).toFixed(1)}k`
                            : item.target}
                          {item.unit || ''}
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={(item.value / item.target) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: `${item.color}20`,
                          '& .MuiLinearProgress-bar': {
                            background: item.color,
                            borderRadius: 2
                          }
                        }}
                      />

                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            item.value >= item.target ? chartColors.success : chartColors.warning,
                          fontWeight: 'bold',
                          mt: 0.3,
                          display: 'block',
                          fontSize: '0.7rem'
                        }}
                      >
                        {item.value >= item.target ? '✅ On Track' : '⚠️ Below Target'}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </ChartWrapper>
        </Grid>

        <Grid size={{ xs: 12, lg: 3.5 }}>
          <ChartWrapper
            title={t('dashboard.productsByCategory')}
            icon={<PieChart size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            darkMode={darkMode}
            tooltip="Visualize your product distribution across categories. Click on segments to filter other charts. This helps you understand your product portfolio and identify category gaps."
            expanded={false}
            onToggleExpand={() => {}}
            data-tour="category-chart"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart>
                <Pie
                  activeIndex={activeIndex}
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  onClick={data => handleCategoryClick(data.name)}
                  style={{ cursor: 'pointer' }}
                  paddingAngle={1}
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={entry.color}
                      stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fill: darkMode ? '#ffffff' : '#333333',
                    textShadow: darkMode
                      ? '0 0 10px rgba(255,255,255,0.3)'
                      : '0 0 10px rgba(0,0,0,0.1)'
                  }}
                >
                  {categoryData.reduce((sum, item) => sum + item.value, 0)}
                </text>
                <text
                  x="50%"
                  y="62%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: '10px',
                    fill: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                    fontWeight: '500'
                  }}
                >
                  {t('dashboard.total')}
                </text>
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Grid>

        <Grid size={{ xs: 12, lg: 3.5 }}>
          <ChartWrapper
            title={t('dashboard.stockLevels')}
            icon={<Package size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            darkMode={darkMode}
            tooltip="Monitor current stock levels vs minimum requirements. Click on bars to see product details. This helps prevent stockouts and optimize inventory levels."
            expanded={false}
            onToggleExpand={() => {}}
            data-tour="stock-levels"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} />
                <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <Box
                          sx={{
                            background: darkMode
                              ? 'rgba(26, 26, 26, 0.95)'
                              : 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid',
                            borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                            borderRadius: 1,
                            p: 1.5,
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            sx={{ color: darkMode ? 'white' : 'black' }}
                          >
                            {label}
                          </Typography>
                          <Typography variant="body2" sx={{ color: chartColors.primary }}>
                            Current Stock: {data.current}
                          </Typography>
                          <Typography variant="body2" sx={{ color: chartColors.warning }}>
                            Minimum Stock: {data.minimum}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                data.current <= data.minimum
                                  ? chartColors.error
                                  : chartColors.success
                            }}
                          >
                            Status: {data.current <= data.minimum ? 'Low Stock' : 'In Stock'}
                          </Typography>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar
                  dataKey="current"
                  fill={chartColors.primary}
                  name="Current Stock"
                  radius={[4, 4, 0, 0]}
                  onClick={data => handleStockClick(data)}
                  style={{ cursor: 'pointer' }}
                />
                <Bar
                  dataKey="minimum"
                  fill={chartColors.warning}
                  name="Minimum Stock"
                  radius={[4, 4, 0, 0]}
                  onClick={data => handleStockClick(data)}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Grid>
      </Grid>

      {/* Top Performing Products */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Box
            data-tour="top-products"
            sx={{
              p: 3,
              borderRadius: 2,
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: darkMode
                  ? '0 8px 32px rgba(16, 172, 132, 0.25), 0 0 0 1px rgba(16, 172, 132, 0.2), 0 0 15px rgba(16, 172, 132, 0.15)'
                  : '0 8px 32px rgba(16, 172, 132, 0.3), 0 0 0 1px rgba(16, 172, 132, 0.2), 0 0 20px rgba(16, 172, 132, 0.1)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" fontWeight="600" sx={{ color: chartColors.success }}>
                  <TrendingUp size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  {t('dashboard.topPerforming')}
                </Typography>
                <Tooltip title="Your highest-value inventory items ranked by total inventory value. This helps you focus on your most profitable products and optimize stock levels.">
                  <IconButton
                    sx={{
                      color: chartColors.success,
                      '&:hover': {
                        color: chartColors.primary,
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <HelpCircle size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {topProductsData.map((product, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={`product-${product.name}`}>
                  <Card
                    sx={{
                      p: 2,
                      background: `linear-gradient(135deg, ${product.color}20 0%, ${product.color}10 100%)`,
                      border: `1px solid ${product.color}40`,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${product.color}30`,
                        border: `1px solid ${product.color}60`
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="h6" fontWeight="600" sx={{ color: product.color }}>
                        #{index + 1}
                      </Typography>
                      <Chip
                        label={formatCurrency(product.value)}
                        size="small"
                        sx={{
                          background: product.color,
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      gutterBottom
                      sx={{
                        color: darkMode ? 'white' : 'black',
                        fontSize: '0.85rem',
                        lineHeight: 1.2
                      }}
                    >
                      {product.name.length > 25
                        ? `${product.name.substring(0, 25)}...`
                        : product.name}
                    </Typography>
                    {product.code && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                          fontSize: '0.75rem',
                          display: 'block',
                          mb: 1
                        }}
                      >
                        Código: {product.code}
                      </Typography>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Typography variant="caption" color="textSecondary">
                        Stock: {product.stock}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatCurrency(product.price)}
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={(product.value / Math.max(...topProductsData.map(p => p.value))) * 100}
                      sx={{
                        mt: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: `${product.color}20`,
                        '& .MuiLinearProgress-bar': {
                          background: product.color,
                          borderRadius: 2
                        }
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Low Stock Alerts */}
      {(lowStockAlerts.length > 0 || stats.lowStockProducts > 0) && (
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            backdropFilter: 'blur(10px)',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <AlertTriangle size={24} color={chartColors.warning} style={{ marginRight: 8 }} />
              <Typography variant="h6" fontWeight="600" color="warning.main">
                {t('dashboard.lowStockAlerts')}
              </Typography>
              <Tooltip title="Critical inventory items that need immediate attention. These products are running low or out of stock and require urgent restocking to prevent lost sales.">
                <IconButton
                  sx={{
                    color: chartColors.warning,
                    '&:hover': {
                      color: chartColors.error,
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <HelpCircle size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Grid container spacing={2}>
            {lowStockAlerts.slice(0, 6).map(product => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: product.quantidade === 0 ? 'error.main' : 'warning.main',
                    borderRadius: 2,
                    background:
                      product.quantidade === 0
                        ? 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    {product.nome}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Code: {product.codigo}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Chip
                      label={`Stock: ${product.quantidade}`}
                      sx={{
                        backgroundColor:
                          product.quantidade === 0
                            ? '#ef4444'  // Vermelho para estoque zerado
                            : '#f59e0b', // Amarelo para estoque baixo
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                      size="small"
                    />
                    <Typography variant="caption" color="textSecondary">
                      Min: {product.estoque_minimo}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(product.quantidade / product.estoque_minimo) * 100}
                    sx={{
                      mt: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:
                          product.quantidade === 0
                            ? '#ef4444'  // Vermelho para estoque zerado
                            : '#f59e0b', // Amarelo para estoque baixo
                        borderRadius: 2
                      }
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

    </Box>
  );
}

Dashboard.propTypes = {
  darkMode: PropTypes.bool.isRequired
};
