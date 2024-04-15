import { useState, useEffect } from 'react';
import { supabase } from "../lib/helper/supabaseClient";
import { Paper, Grid, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function AddProjectForm({ clientId }) {
    const [projectName, setProjectName] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [contact, setContact] = useState('');

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      // Clear input fields when closing the modal
      setProjectName('');
      setLocation('');
      setContact('');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const { data, error } = await supabase.from('projects').insert([{ client_id: clientId, project_name: projectName, location: location }]);

        if (error) {
          throw error;
        }

        // Clear input fields after successful submission
        setProjectName('');
        setLocation('');
        setLoading(false);
        setOpen(false);
        alert('Project added successfully!');
      } catch (error) {
        console.error('Error adding project:', error.message);
        setLoading(false);
        alert('Failed to add project. Please try again.');
      }
    };

    useEffect(() => {
      // Fetch any additional data needed for the form here
    }, []);

    return (
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Project
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogContent>
            <Paper style={{ padding: '20px' }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="project-name"
                      label="Project Name"
                      variant="outlined"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="location"
                      label="Location"
                      variant="outlined"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="contact-name"
                      label="Contacts"
                      variant="outlined"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                      {loading ? 'Adding Project...' : 'Add Project'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
