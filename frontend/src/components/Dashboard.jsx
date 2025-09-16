import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Card,
  Chip,
  Paper,
  LinearProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
  HelpCircle,
  PieChart,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Pie,
  Cell,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { productsAPI, suppliersAPI, alertsAPI } from '../services/api.jsx';
import { StatCard, ChartWrapper, LoadingSpinner, ErrorMessage } from './common';
import { chartColors, formatCurrency } from '../utils/chartUtils';

export default function Dashboard({ darkMode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardData();

    // Listen for product data changes from other components
    const handleProductsDataChanged = () => {
      fetchDashboardData();
    };

    window.addEventListener('productsDataChanged', handleProductsDataChanged);

    return () => {
      window.removeEventListener('productsDataChanged', handleProductsDataChanged);
    };
  }, [refreshKey]);

  // Auto-refresh every 60 seconds (reduzido de 30s para 60s)
  useEffect(() => {
    const interval = setInterval(() => {
      // Só faz refresh se a página estiver visível
      if (!document.hidden) {
        fetchDashboardData();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, suppliersRes, alertsRes] = await Promise.all([
        productsAPI.getAll(),
        suppliersAPI.getAll(),
        alertsAPI.getLowStock(),
      ]);

      setProducts(productsRes.data);
      setSuppliers(suppliersRes.data);
      setLowStockAlerts(alertsRes.data);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
        highlightStock: true,
      },
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
    }, 0),
  };

  // Website Traffic Data
  const websiteTrafficData = [
    {
      metric: t('dashboard.pageViews'),
      value: 20500,
      target: 25000,
      color: chartColors.primary,
      icon: '📊',
    },
    {
      metric: t('dashboard.uniqueVisitors'),
      value: 12450,
      target: 15000,
      color: chartColors.success,
      icon: '👥',
    },
    {
      metric: t('dashboard.avgSessionTime'),
      value: 4.2,
      target: 5.0,
      color: chartColors.warning,
      icon: '⏱️',
      unit: 'min',
    },
    {
      metric: t('dashboard.bounceRate'),
      value: 32.5,
      target: 25.0,
      color: chartColors.error,
      icon: '📉',
      unit: '%',
    },
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
          color: chartColors.chartColors[index % chartColors.chartColors.length],
        }))
      : [
          { name: 'Processors', value: 5, color: chartColors.chartColors[0] },
          { name: 'Graphics Cards', value: 3, color: chartColors.chartColors[1] },
          { name: 'Memory', value: 4, color: chartColors.chartColors[2] },
          { name: 'Storage', value: 6, color: chartColors.chartColors[3] },
        ];

  // Stock Levels Data
  const stockLevelsData =
    products.length > 0
      ? products.slice(0, 8).map(product => ({
          name: product.nome.length > 15 ? `${product.nome.substring(0, 15)}...` : product.nome,
          current: product.quantidade,
          minimum: product.estoque_minimo,
          color:
            product.quantidade <= product.estoque_minimo ? chartColors.error : chartColors.success,
        }))
      : [
          { name: 'AMD Ryzen 7 5800X', current: 15, minimum: 5, color: chartColors.success },
          { name: 'NVIDIA RTX 3080', current: 3, minimum: 5, color: chartColors.error },
          { name: 'Samsung 970 EVO 1TB', current: 25, minimum: 10, color: chartColors.success },
          { name: 'Corsair Vengeance 16GB', current: 8, minimum: 15, color: chartColors.error },
          { name: 'ASUS ROG Strix B550', current: 12, minimum: 8, color: chartColors.success },
          { name: 'Seagate Barracuda 2TB', current: 18, minimum: 12, color: chartColors.success },
          { name: 'EVGA 750W Gold', current: 6, minimum: 10, color: chartColors.error },
          { name: 'Logitech G Pro X', current: 22, minimum: 15, color: chartColors.success },
        ];

  // Top Performing Products Data
  const topProductsData =
    products.length > 0
      ? products
          .sort((a, b) => b.preco * b.quantidade - a.preco * a.quantidade)
          .slice(0, 5)
          .map((product, index) => ({
            name: product.nome,
            value: product.preco * product.quantidade,
            stock: product.quantidade,
            price: product.preco,
            color: chartColors.chartColors[index % chartColors.chartColors.length],
          }))
      : [
          {
            name: 'AMD Ryzen 7 5800X',
            value: 15999.0,
            stock: 10,
            price: 1599.9,
            color: chartColors.chartColors[0],
          },
          {
            name: 'NVIDIA RTX 4060 8GB',
            value: 21999.0,
            stock: 10,
            price: 2199.9,
            color: chartColors.chartColors[1],
          },
          {
            name: 'SSD NVMe 1TB Kingston',
            value: 4299.0,
            stock: 10,
            price: 429.9,
            color: chartColors.chartColors[2],
          },
          {
            name: 'Monitor 24" 144Hz',
            value: 8999.0,
            stock: 10,
            price: 899.9,
            color: chartColors.chartColors[3],
          },
          {
            name: 'Teclado Mecânico RGB',
            value: 2999.0,
            stock: 10,
            price: 299.9,
            color: chartColors.chartColors[4],
          },
        ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: chartColors.gradientColors.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
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
                transform: 'rotate(180deg)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <RotateCcw size={20} />
          </IconButton>
        </Tooltip>
      </Box>

      <ErrorMessage error={error} onRetry={fetchDashboardData} onClose={() => setError(null)} />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
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
        <Grid xs={12} sm={6} md={3}>
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
        <Grid xs={12} sm={6} md={3}>
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
        <Grid xs={12} sm={6} md={3}>
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
        <Grid xs={12} lg={5}>
          <ChartWrapper
            title={t('dashboard.websiteTraffic')}
            icon={<Activity size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            darkMode={darkMode}
            tooltip="Monitor website traffic metrics including page views, unique visitors, session time, and bounce rate. Track your digital marketing performance and user engagement."
            expanded={false}
            onToggleExpand={() => {}}
          >
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {websiteTrafficData.map((item, index) => (
                  <Grid xs={6} key={index}>
                    <Card
                      sx={{
                        p: 2,
                        background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`,
                        border: `1px solid ${item.color}30`,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 20px ${item.color}20`,
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="h6" sx={{ color: item.color, fontSize: '1.5rem' }}>
                          {item.icon}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}
                        >
                          {item.metric}
                        </Typography>
                      </Box>

                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: darkMode ? '#ffffff' : '#000000', mb: 0.5 }}
                      >
                        {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
                        {item.unit || ''}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography
                          variant="caption"
                          sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}
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
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: `${item.color}20`,
                          '& .MuiLinearProgress-bar': {
                            background: item.color,
                            borderRadius: 3,
                          },
                        }}
                      />

                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            item.value >= item.target ? chartColors.success : chartColors.warning,
                          fontWeight: 'bold',
                          mt: 0.5,
                          display: 'block',
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

        <Grid xs={12} lg={3.5}>
          <ChartWrapper
            title={t('dashboard.productsByCategory')}
            icon={<PieChart size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            darkMode={darkMode}
            tooltip="Visualize your product distribution across categories. Click on segments to filter other charts. This helps you understand your product portfolio and identify category gaps."
            expanded={false}
            onToggleExpand={() => {}}
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
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
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
                      : '0 0 10px rgba(0,0,0,0.1)',
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
                    fontWeight: '500',
                  }}
                >
                  {t('dashboard.total')}
                </text>
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Grid>

        <Grid xs={12} lg={3.5}>
          <ChartWrapper
            title={t('dashboard.stockLevels')}
            icon={<Package size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            darkMode={darkMode}
            tooltip="Monitor current stock levels vs minimum requirements. Click on bars to see product details. This helps prevent stockouts and optimize inventory levels."
            expanded={false}
            onToggleExpand={() => {}}
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
                            backdropFilter: 'blur(10px)',
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
                                  : chartColors.success,
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
        <Grid xs={12}>
          <Box
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
                transform: 'translateY(-2px)',
              },
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
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <HelpCircle size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {topProductsData.map((product, index) => (
                <Grid xs={12} sm={6} md={4} lg={2} key={index}>
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
                        border: `1px solid ${product.color}60`,
                      },
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
                          fontWeight: 'bold',
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
                        lineHeight: 1.2,
                      }}
                    >
                      {product.name.length > 25
                        ? `${product.name.substring(0, 25)}...`
                        : product.name}
                    </Typography>

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
                          borderRadius: 2,
                        },
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
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
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
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <HelpCircle size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Grid container spacing={2}>
            {lowStockAlerts.slice(0, 6).map(product => (
              <Grid xs={12} sm={6} md={4} key={product.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: product.quantidade === 0 ? 'error.main' : 'warning.main',
                    borderRadius: 2,
                    background:
                      product.quantidade === 0
                        ? 'linear-gradient(135deg, rgba(244,67,54,0.1) 0%, rgba(244,67,54,0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(255,152,0,0.05) 100%)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
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
                      color={product.quantidade === 0 ? 'error' : 'warning'}
                      size="small"
                    />
                    <Typography variant="caption" color="textSecondary">
                      Min: {product.estoque_minimo}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(product.quantidade / product.estoque_minimo) * 100}
                    color={product.quantidade === 0 ? 'error' : 'warning'}
                    sx={{ mt: 1 }}
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
  darkMode: PropTypes.bool.isRequired,
};
