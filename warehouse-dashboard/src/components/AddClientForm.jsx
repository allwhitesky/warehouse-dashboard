import { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import { supabase } from "../lib/helper/supabaseClient";

export default function AddClientForm() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from('clients').insert([{ client_name: clientName, client_email: clientEmail }]);

      if (error) {
        throw error;
      }

      // Clear input fields after successful submission
      setClientName('');
      setClientEmail('');
      setLoading(false);
      alert('Client added successfully!');
    } catch (error) {
      console.error('Error adding client:', error.message);
      setLoading(false);
      alert('Failed to add client. Please try again.');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>

      <Paper style={{ padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="client-name"
                label="Client Name"
                variant="outlined"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="client-email"
                label="Client Email"
                variant="outlined"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Adding Client...' : 'Add Client'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
}
