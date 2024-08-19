import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnapprovedUsers, approveUser, fetchDashboardMetrics } from '../store/adminSlice';
import { Typography, Button, List, ListItem, ListItemText, Container, Box, TextField } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  const aggregateData = metrics && metrics.artPieces ? metrics.artPieces.reduce((acc, item) => {
    const existing = acc.find(entry => entry.type === item.type);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ type: item.type, count: 1 });
    }
    return acc;
  }, []) : [];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Unapproved Users
          </Typography>
          <List>
            {unapprovedUsers.map((user) => (
              <ListItem key={user._id}>
                <ListItemText primary={user.username} />
                <Button onClick={() => handleApproveUser(user._id)} variant="contained" color="primary">
                  Approve
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Dashboard Metrics
          </Typography>
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

          {metrics && metrics.artPieces && metrics.artPieces.length > 0 && (
            <Box sx={{ mt: 2, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aggregateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
