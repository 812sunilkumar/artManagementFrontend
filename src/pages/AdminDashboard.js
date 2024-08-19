import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnapprovedUsers, approveUser, fetchDashboardMetrics } from '../store/adminSlice';
import { Typography, Button, List, ListItem, ListItemText, Container, Box, TextField, Grid, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const unapprovedUsers = useSelector((state) => state.admin.unapprovedUsers);
  const metrics = useSelector((state) => state.admin.metrics);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    dispatch(fetchUnapprovedUsers());
  }, [dispatch]);

  const handleApproveUser = (id) => {
    dispatch(approveUser(id));
  };

  const handleFetchMetrics = () => {
    if (startDate && endDate) {
      dispatch(fetchDashboardMetrics({ startDate, endDate }));
    }
  };

  const formatArtPieChartData = (artPieces) => {
    const countByType = artPieces.reduce((acc, piece) => {
      acc[piece.type] = (acc[piece.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(countByType).map(([name, value]) => ({ name, value }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Unapproved Users
              </Typography>
              <List>
                {unapprovedUsers.map((user) => (
                  <ListItem key={user._id}>
                    <ListItemText primary={user.username} />
                    <Button onClick={() => handleApproveUser(user._id)} variant="contained" color="primary" size="small">
                      Approve
                    </Button>
                  </ListItem>
                ))}
              </List>
              {unapprovedUsers.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  No unapproved users at the moment.
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Dashboard Metrics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mr: 2 }}
                />
                <TextField
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mr: 2 }}
                />
                <Button onClick={handleFetchMetrics} variant="contained" color="primary">
                  Fetch Metrics
                </Button>
              </Box>

              {metrics && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Art Pieces by Type
                  </Typography>
                  <Box sx={{ height: 300, mb: 4 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.artPieces}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Art Distribution
                  </Typography>
                  <Box sx={{ height: 300, mb: 4 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formatArtPieChartData(metrics.artPieces)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {formatArtPieChartData(metrics.artPieces).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Employee Production
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.employeeProduction}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="username" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="artCount" name="Art Count" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="averageTime" name="Avg Time (hours)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;