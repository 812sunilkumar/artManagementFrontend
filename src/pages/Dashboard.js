import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArts, createArt, completeArt, fetchArtTypes } from '../store/artSlice';
import { Typography, Select, MenuItem, Button, List, ListItem, ListItemText, Container, Box, Paper, Grid } from '@mui/material';

const Dashboard = () => {
  const dispatch = useDispatch();
  const arts = useSelector((state) => state.art.list);
  const artTypes = useSelector((state) => state.art.types);
  const [selectedArt, setSelectedArt] = useState('');

  useEffect(() => {
    dispatch(fetchArts());
    dispatch(fetchArtTypes());
  }, [dispatch]);

  const handleCreateArt = async () => {
    if (!selectedArt) return;
    await dispatch(createArt({ type: selectedArt }));
    setSelectedArt('');
  };

  const handleCompleteArt = async (id) => {
    await dispatch(completeArt(id));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Employee Dashboard
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Create New Art
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Select
                  value={selectedArt}
                  onChange={(e) => setSelectedArt(e.target.value)}
                  displayEmpty
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="" disabled>
                    Select Art Type
                  </MenuItem>
                  {artTypes.map((type) => (
                    <MenuItem key={type._id} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                <Button onClick={handleCreateArt} variant="contained" color="primary" fullWidth>
                  Create Art
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                My Arts
              </Typography>
              {arts.length > 0 ? (
                <List>
                  {arts.map((art) => (
                    <ListItem key={art._id}>
                      <ListItemText
                        primary={art.type}
                        secondary={`Started: ${new Date(art.timeStarted).toLocaleString()}`}
                      />
                      {art.timeCompleted ? (
                        <Typography variant="body2">
                          Completed: {new Date(art.timeCompleted).toLocaleString()}
                        </Typography>
                      ) : (
                        <Button onClick={() => handleCompleteArt(art._id)} variant="outlined" color="primary">
                          Complete
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  You haven't created any art pieces yet. Start by selecting an art type above!
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;