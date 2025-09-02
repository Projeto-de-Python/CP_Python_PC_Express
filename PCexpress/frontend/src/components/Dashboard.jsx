import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  Users,
  ShoppingCart,
  RefreshCw,
} from 'lucide-react';
import { insightsAPI } from '../services/api.jsx';
import { StatCard, GradientText } from './common/StyledComponents';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await insightsAPI.getOverview();
      setOverview(response.data);
    } catch (error) {
      setError(`Failed to load dashboard data: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <GradientText variant="h4" gradient="primary">
            📊 Dashboard
          </GradientText>
          <Typography variant="body1" color="text.secondary">
            Visão geral do seu sistema de gestão de estoque
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={fetchDashboardData}
          disabled={loading}
        >
          Atualizar
        </Button>
      </Box>

      {/* Estatísticas Principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Produtos"
            value={overview?.inventory_summary?.total_products || 0}
            icon={<Package size={24} />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valor Total"
            value={`R$ ${(overview?.inventory_summary?.total_stock_value || 0).toFixed(2)}`}
            icon={<DollarSign size={24} />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estoque Baixo"
            value={overview?.inventory_summary?.low_stock_count || 0}
            icon={<AlertTriangle size={24} />}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Vendas (30 dias)"
            value={overview?.sales_analysis?.total_sales || 0}
            icon={<ShoppingCart size={24} />}
            gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
          />
        </Grid>
      </Grid>

      {/* Cards de Informação */}
      <Grid container spacing={3}>
        {/* Resumo do Inventário */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                📦 Resumo do Inventário
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Produtos Ativos:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {overview?.inventory_summary?.total_products || 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Valor Total:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  R$ {(overview?.inventory_summary?.total_stock_value || 0).toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Fora de Estoque:</Typography>
                <Typography variant="body2" fontWeight="bold" color="error.main">
                  {overview?.inventory_summary?.out_of_stock_count || 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Saúde do Estoque:</Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  {(overview?.inventory_summary?.stock_health_percentage || 0).toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Análise de Vendas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                💰 Análise de Vendas (30 dias)
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Total de Vendas:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {overview?.sales_analysis?.total_sales || 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Valor Total:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  R$ {(overview?.sales_analysis?.total_sales_value || 0).toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Ticket Médio:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  R$ {(overview?.sales_analysis?.average_sale_value || 0).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recomendações */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                💡 Recomendações do Sistema
              </Typography>
              {overview?.recommendations?.length > 0 ? (
                overview.recommendations.map((rec, index) => (
                  <Alert 
                    key={index} 
                    severity={rec.priority === 'high' ? 'warning' : 'info'} 
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2">{rec.message}</Typography>
                    <Typography variant="caption" display="block">{rec.action}</Typography>
                  </Alert>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma recomendação disponível no momento.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}