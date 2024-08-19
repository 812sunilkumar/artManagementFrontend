import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtTypes, createArtType } from '../store/artSlice';
import { Typography, TextField, Button, List, ListItem, ListItemText, Container, Box } from '@mui/material';

const ArtTypeManagement = () => {
  const dispatch = useDispatch();
  const artTypes = useSelector((state) => state.art.types);
  const [newArtType, setNewArtType] = useState('');

  useEffect(() => {
    dispatch(fetchArtTypes());
  }, [dispatch]);

  const handleCreateArtType = (e) => {
    e.preventDefault();
    if (newArtType.trim()) {
      dispatch(createArtType(newArtType.trim()));
      setNewArtType('');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Art Type Management
        </Typography>

        <Box component="form" onSubmit={handleCreateArtType} sx={{ mb: 4 }}>
          <TextField
            label="New Art Type"
            value={newArtType}
            onChange={(e) => setNewArtType(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Create Art Type
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>
          Existing Art Types
        </Typography>
        <List>
          {artTypes.map((type) => (
            <ListItem key={type._id}>
              <ListItemText primary={type.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ArtTypeManagement;