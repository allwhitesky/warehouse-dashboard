import { useState, useEffect } from 'react';
import { supabase } from "../lib/helper/supabaseClient";
import { TextField, Button, Grid, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import styled from '@emotion/styled';

async function getProjects() {
  let { data: projects, error } = await supabase
    .from('projects')
    .select('*');
  return projects;
}

async function getClients() {
  let { data: clients, error } = await supabase
    .from('clients')
    .select('*');
  return clients;
}

async function insertItem(item) {
    try {
        const { data, error } = await supabase
            .from('items')
            .insert([
                {
                    item_name: item.item_name,
                    project_id: item.project_id,
                    client_id: item.client_id,
                    item_type: item.item_type,
                    item_number: item.item_number,
                    condition: item.condition,
                    item_notes: item.item_notes,
                    damage_notes: item.damage_notes,
                    location: item.location,
                    inspection_date: item.inspection_date,
                    inspector: item.inspector,
                    photos: item.photos,
                    manufacturer: item.manufacturer,
                    dimensions: item.dimensions,
                    carrier: item.carrier,
                    tracking_number: item.tracking_number,
                    arrival_date_scheduled: item.arrival_date_scheduled,
                    arrival_date_actual: item.arrival_date_actual,
                    ship_date_scheduled: item.ship_date_scheduled,
                    ship_date_actual: item.ship_date_actual,
                    scheduled_installation_date: item.scheduled_installation_date,
                    installation_date: item.installation_date
                }
            ]);
        if (error) {
            throw error;
        }
        if (data) {
            console.log('Item inserted successfully:', data);
        }
    } catch (error) {
        console.error('Error inserting item:', error.message);
        throw error;
    }
}

const AddItemForm = ({ onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [clientId, setClientId] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemNumber, setItemNumber] = useState('');
  const [condition, setCondition] = useState('');
  const [itemNotes, setItemNotes] = useState('');
  const [damageNotes, setDamageNotes] = useState('');
  const [location, setLocation] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspector, setInspector] = useState('');
  const [photos, setPhotos] = useState([]);
  const [manufacturer, setManufacturer] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [arrivalDateScheduled, setArrivalDateScheduled] = useState('');
  const [arrivalDateActual, setArrivalDateActual] = useState('');
  const [shipDateScheduled, setShipDateScheduled] = useState('');
  const [shipDateActual, setShipDateActual] = useState('');
  const [scheduledInstallationDate, setScheduledInstallationDate] = useState('');
  const [installationDate, setInstallationDate] = useState('');
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = {
        item_name: itemName,
        project_id: projectId,
        client_id: clientId,
        item_type: itemType,
        item_number: itemNumber,
        condition: condition,
        item_notes: itemNotes,
        damage_notes: damageNotes,
        location: location,
        inspection_date: inspectionDate,
        inspector: inspector,
        photos: photos,
        manufacturer: manufacturer,
        dimensions: dimensions,
        carrier: carrier,
        tracking_number: trackingNumber,
        arrival_date_scheduled: arrivalDateScheduled,
        arrival_date_actual: arrivalDateActual,
        ship_date_scheduled: shipDateScheduled,
        ship_date_actual: shipDateActual,
        scheduled_installation_date: scheduledInstallationDate,
        installation_date: installationDate,
    };

    try {
        await insertItem(newItem);
        clearForm();
    } catch (error) {
        console.error('Error inserting item:', error.message);
        // Handle error appropriately, e.g., show error message to the user
    }
};

  const clearForm = () => {
    setItemName('');
    setProjectId('');
    setClientId('');
    setItemType('');
    setItemNumber('');
    setCondition('');
    setItemNotes('');
    setDamageNotes('');
    setLocation('');
    setInspectionDate('');
    setInspector('');
    setPhotos([]);
    setManufacturer('');
    setDimensions('');
    setCarrier('');
    setTrackingNumber('');
    setArrivalDateScheduled('');
    setArrivalDateActual('');
    setShipDateScheduled('');
    setShipDateActual('');
    setScheduledInstallationDate('');
    setInstallationDate('');
  };

  
  useEffect(() => {
    // Initialize filtered projects and clients with all projects and clients
    setFilteredProjects(projects);
    setFilteredClients(clients);
  }, [projects, clients]);

  useEffect(() => {
    const fetchProjectsAndClients = async () => {
      try {
        const projectsData = await getProjects();
        const clientsData = await getClients();
        setProjects(projectsData);
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching projects and clients:', error);
      }
    };
  
    fetchProjectsAndClients();
  }, []);

  const handleClientChange = (event) => {
    const selectedClientId = event.target.value;
    setClientId(selectedClientId);
    // Filter projects based on selected client
    const filteredProjects = projects.filter(project => project.client_id === selectedClientId);
    setProjects(filteredProjects);
  };

  const handleProjectChange = (event) => {
    const selectedProjectId = event.target.value;
    setProjectId(selectedProjectId);
    
    // Filter clients based on selected project
    const filteredClients = clients.filter(client => client.project_id === selectedProjectId);
    setFilteredClients(filteredClients);
    
    // Reset client selection if it's not available for the selected project
    if (!filteredClients.find(client => client.client_id === clientId)) {
      setClientId('');
    }
  };


  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  console.log("Projects: ", projects)
  console.log("Clients: ", clients)

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        id="item-name"
        label="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth required>
        <InputLabel id="client-name-label">Client Name</InputLabel>
        <Select
          labelId="client-name-label"
          id="client-name"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <MenuItem value="">
            <em>Select Client</em>
          </MenuItem>
          {clients.map(client => (
            <MenuItem key={client.client_id} value={client.client_id}>{client.client_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth required>
        <InputLabel id="project-name-label">Project Name</InputLabel>
        <Select
          labelId="project-name-label"
          id="project-name"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <MenuItem value="">
            <em>Select Project</em>
          </MenuItem>
          {projects.map(project => (
            <MenuItem key={project.project_id} value={project.project_id}>{project.project_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        id="item-type"
        label="Item Type"
        value={itemType}
        onChange={(e) => setItemType(e.target.value)}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        id="item-number"
        label="Item Number"
        value={itemNumber}
        onChange={(e) => setItemNumber(e.target.value)}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        id="condition"
        label="Condition"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        id="inspection-date"
        label="Inspection Date"
        type="date"
        value={inspectionDate}
        onChange={(e) => setInspectionDate(e.target.value)}
        required
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        id="arrival-date-scheduled"
        label="Arrival Date Scheduled"
        type="date"
        value={arrivalDateScheduled}
        onChange={(e) => setArrivalDateScheduled(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        id="arrival-date-actual"
        label="Arrival Date Actual"
        type="date"
        value={arrivalDateActual}
        onChange={(e) => setArrivalDateActual(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
    
    <Grid item xs={12}>
      <TextField
        fullWidth
        id="item-notes"
        label="Item Notes"
        multiline
        rows={4}
        value={itemNotes}
        onChange={(e) => setItemNotes(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        id="damage-notes"
        label="Damage Notes"
        multiline
        rows={4}
        value={damageNotes}
        onChange={(e) => setDamageNotes(e.target.value)}
      />
    </Grid>
    <Grid container spacing={2} justifyContent="center" margin="5px;">
  <Grid item>
    <Button type="submit" variant="contained" color="primary">
      Add Item
    </Button>
  </Grid>
  <Grid item>
    <input
      type="file"
      onChange={handlePhotoChange}
      multiple
      accept="image/*"
      style={{ display: 'none' }}
      id="photos"
    />
    <label htmlFor="photos">
      <Button variant="contained" component="span">
        Upload Photos
      </Button>
    </label>
  </Grid>
</Grid>
  </Grid>
</form>
  )
};

export default AddItemForm;

