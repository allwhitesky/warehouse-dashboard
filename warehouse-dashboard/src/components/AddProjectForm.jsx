import { useState, useEffect } from 'react';
import { supabase } from "../lib/helper/supabaseClient";
import { Paper, Grid, TextField, Button, FormControl, Select, MenuItem, InputLabel } from '@mui/material';



export default function AddProjectForm() {
    const [clientID, setClientID] = useState('');
    const [projectName, setProjectName] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [contact, setContact] = useState('');
  
    useEffect(() => {
      async function fetchClients() {
        try {
          const { data, error } = await supabase.from('clients').select('client_id, client_name');
          if (error) {
            throw error;
          }
          setClients(data);
        } catch (error) {
          console.error('Error fetching clients:', error.message);
        }
      }
      fetchClients();
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const { data, error } = await supabase.from('projects').insert([{ client_id: clientID, project_name: projectName, location: location }]);
  
        if (error) {
          throw error;
        }
  
        // Clear input fields after successful submission
        setClientID('');
        setProjectName('');
        setLocation('');
        setLoading(false);
        alert('Project added successfully!');
      } catch (error) {
        console.error('Error adding project:', error.message);
        setLoading(false);
        alert('Failed to add project. Please try again.');
      }
    };
  
    return (
      <div style={{ marginTop: '20px' }}>
        <Paper style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
              <TextField
                    select
                    required
                    fullWidth
                    id="client-name"
                    label="Client Name"
                    variant="outlined"
                    value={clientID}
                    onChange={(e) => setClientID(e.target.value)}
                    >
                    {clients.map((client) => (
                        <MenuItem key={client.client_id} value={client.client_id}>{client.client_name}</MenuItem>
                    ))}
                    </TextField>
              </Grid>
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
      </div>
    );
  }