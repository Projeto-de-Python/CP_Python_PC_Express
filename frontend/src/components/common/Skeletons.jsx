import { Box, Grid, Skeleton } from '@mui/material';
import React from 'react';

export const DashboardSkeleton = () => (
  <Box>
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map(i => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <Skeleton variant="rounded" height={120} animation="wave" />
        </Grid>
      ))}
    </Grid>
    <Grid container spacing={3}>
      {[1, 2, 3].map(i => (
        <Grid key={i} size={{ xs: 12, md: i === 1 ? 6 : 3 }}>
          <Skeleton variant="rounded" height={320} animation="wave" />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export const TableSkeleton = ({ rows = 6 }) => (
  <Box>
    <Skeleton variant="text" width={220} sx={{ mb: 2 }} />
    {[...Array(rows)].map((_, idx) => (
      <Skeleton key={idx} height={48} animation="wave" />
    ))}
  </Box>
);

export default { DashboardSkeleton, TableSkeleton };


