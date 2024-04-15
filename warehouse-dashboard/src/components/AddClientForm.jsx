import { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { supabase } from "../lib/helper/supabaseClient";
import CloseIcon from '@mui/icons-material/Close';

export default function AddClientForm() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setClientName('');
    setClientEmail('');
  };

  const handleOpen = () => {
    setOpen(true);
  };

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
      setOpen(false);
      alert('Client added successfully!');
      window.location.reload()
    } catch (error) {
      console.error('Error adding client:', error.message);
      setLoading(false);
      alert('Failed to add client. Please try again.');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Client
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
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
              </Grid>
            </form>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Adding Client...' : 'Submit'}
          </Button>
        </DialogActions>
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </Dialog>
    </div>
  );
}
