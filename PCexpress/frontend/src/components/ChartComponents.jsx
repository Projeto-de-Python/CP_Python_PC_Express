import React from 'react';
import PropTypes from 'prop-types';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Area,
} from 'recharts';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';

export const SalesTrendChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Alert severity="info">No sales data available for visualization</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <RechartsTooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const DemandForecastChart = ({ data, title }) => {
  if (!data || !data.historical || !data.forecast) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Alert severity="info">No forecast data available</Alert>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    ...data.historical.map(item => ({
      ...item,
      type: 'Historical',
      forecast: null,
      confidence_lower: null,
      confidence_upper: null
    })),
    ...data.forecast.map(item => ({
      ...item,
      actual: null,
      trend: null,
      type: 'Forecast'
    }))
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Demand" />
            <Line type="monotone" dataKey="trend" stroke="#82ca9d" name="Trend" />
            <Line type="monotone" dataKey="forecast" stroke="#ffc658" name="Forecast" strokeDasharray="5 5" />
            <Area dataKey="confidence_upper" fill="#ffc658" fillOpacity={0.1} stroke="none" />
            <Area dataKey="confidence_lower" fill="#ffc658" fillOpacity={0.1} stroke="none" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const PriceAnalysisChart = ({ data, title }) => {
  if (!data || !data.demand_curve || data.demand_curve.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Alert severity="info">No price analysis data available</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data.demand_curve}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="price" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <RechartsTooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
          </ComposedChart>
        </ResponsiveContainer>
        <Box mt={2}>
          <Typography variant="body2">
            <strong>Current Price:</strong> R$ {data.current_price}
          </Typography>
          <Typography variant="body2">
            <strong>Optimal Price:</strong> R$ {data.optimal_price}
          </Typography>
          <Typography variant="body2">
            <strong>Price Elasticity:</strong> {data.elasticity?.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const StockPredictionChart = ({ data, title }) => {
  if (!data || !data.stock_levels || data.stock_levels.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Alert severity="info">No stock prediction data available</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data.stock_levels}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="stock" stroke="#8884d8" name="Stock Level" />
            <Line type="monotone" dataKey="daily_demand" stroke="#ff7300" name="Daily Demand" />
            <Line type="monotone" dataKey="reorder_point" stroke="#ff0000" name="Reorder Point" strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
        <Box mt={2}>
          <Typography variant="body2">
            <strong>Current Stock:</strong> {data.current_stock}
          </Typography>
          <Typography variant="body2">
            <strong>Safety Stock:</strong> {data.safety_stock}
          </Typography>
          <Typography variant="body2">
            <strong>Lead Time:</strong> {data.lead_time_days} days
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// PropTypes for optimization
SalesTrendChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string.isRequired
};

DemandForecastChart.propTypes = {
  data: PropTypes.shape({
    historical: PropTypes.array,
    forecast: PropTypes.array
  }),
  title: PropTypes.string.isRequired
};

PriceAnalysisChart.propTypes = {
  data: PropTypes.shape({
    demand_curve: PropTypes.array,
    current_price: PropTypes.number,
    optimal_price: PropTypes.number,
    elasticity: PropTypes.number
  }),
  title: PropTypes.string.isRequired
};

StockPredictionChart.propTypes = {
  data: PropTypes.shape({
    stock_levels: PropTypes.array,
    current_stock: PropTypes.number,
    safety_stock: PropTypes.number,
    lead_time_days: PropTypes.number
  }),
  title: PropTypes.string.isRequired
};

export default {
  SalesTrendChart,
  DemandForecastChart,
  PriceAnalysisChart,
  StockPredictionChart
};
