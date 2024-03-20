import { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Card, CardMedia, Modal, Button } from '@mui/material'
import { supabase } from "../lib/helper/supabaseClient";
import NestedModal from './ItemModal'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { NavigateBefore, NavigateNext, Close } from '@mui/icons-material';
import AddItemForm from './AddItemForm'

async function getProjects() {
  let { data: projects, error } = await supabase
    .from('projects')
    .select('*')
  return projects
}


export default function BasicTable({ current_project, clients }) {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [projects, setProjects] = useState([{}])
  const [updatedItems, setUpdatedItems] = useState(null);
  const [deletedItem, setDeletedItem] = useState(null);
  const [addedItem, setAddedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data);
    });
  }, []);

  useEffect(() => {
    //console.log("HERE IN THE UPDATE ITEMS")
    if (updatedItems) {
      setItems(prevItems => {
        const updatedItemsMap = new Map(updatedItems.map(item => [item.item_id, item]));
        return prevItems.map(item => updatedItemsMap.get(item.item_id) || item);
      });
    }
  }, [updatedItems]);

  useEffect(() => {
    //console.log("HERE IN THE DELETE ITEMS")
    if (deletedItem) {
      setItems(prevItems => prevItems.filter(item => item.item_id !== deletedItem));
    }
  }, [deletedItem]);

  useEffect(() => {
    async function fetchItems() {
      setItems([])
      try {
        let { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('project_id', current_project)

        if (error) {
          throw error
        }
        setItems(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching items:', error.message)
        setLoading(false)
      }
    }
    fetchItems()
  }, [current_project])

  if (loading) {
    return <div>Loading...</div>
  }
  // const handleAddItem = async (item) => {
  //   console.log("ITEMS YO+++++", items)
  //   try {
  //     const { data, error } = await supabase
  //       .from('items')
  //       .insert(item)
  //       .select();

  //     if (error) {
  //       console.error('Error adding item:', error.message);
  //     } else {
  //       setItems((prevItems) => [...prevItems, ...data]);
  //     }
  //   } catch (error) {
  //     console.error('Error adding item:', error.message);
  //   }
  // };

  function getProjectName(projectId, projects) {
    const project = projects.find(project => project.project_id === projectId);
    return project ? project.project_name : 'Unknown';
  }
  
  function getClientName(clientId, projects) {
    const project = projects.find(project => project.client_id === clientId);
    return project ? project.client_name : 'Unknown';
  }
  
  const handleOpenModal = (photos) => {
    setSelectedPhotos(photos);
    setModalOpen(true);
  };

  function PhotoModal({ open, handleClose, photos }) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
    const handlePrevPhoto = () => {
      setSelectedPhotoIndex(prevIndex => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    };
  
    const handleNextPhoto = () => {
      setSelectedPhotoIndex(prevIndex => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    };
  
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            width: '80vw',
            height: '65vh',
          },
        }}
      >
        <DialogTitle>Photos</DialogTitle>
        <DialogContent>
        <IconButton
          aria-label="previous"
          style={{
            position: 'absolute',
            left: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Slight background color
            top: '50%', // Center vertically
            transform: 'translateY(-50%)', // Adjust for vertical centering
          }}
          onClick={handlePrevPhoto}
        >
            <NavigateBefore />
          </IconButton>
          <IconButton
            aria-label="next"
            style={{
              position: 'absolute',
              right: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.5)', // Slight background color
              top: '50%', // Center vertically
              transform: 'translateY(-50%)', // Adjust for vertical centering
            }}
            onClick={handleNextPhoto}
          >
            <NavigateNext />
          </IconButton>
          {photos.length > 0 && (
            <CardMedia
              component="img"
              height="100%" // Adjust height as needed
              image={photos[selectedPhotoIndex].dataUrl}
              alt={`Photo ${selectedPhotoIndex}`}
              style={{ margin: 'auto', display: 'block' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  
  console.log("===items: ", items)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{ width: '80%' }}>
      <AddItemForm projects={projects} clients={clients} />
      <PhotoModal open={modalOpen} handleClose={() => setModalOpen(false)} photos={selectedPhotos} />
        <TableContainer component={Paper} sx={{ maxHeight: 600}}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Edit Item</TableCell>
                <TableCell>Item ID</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Item Type</TableCell>
                <TableCell>Item Number</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Item Notes</TableCell>
                <TableCell>Damage Notes</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Inspection Date</TableCell>
                <TableCell>Inspector</TableCell>
                <TableCell style={{ overflowX: 'auto' }}>Photos</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Dimensions</TableCell>
                <TableCell>Carrier</TableCell>
                <TableCell>Tracking Number</TableCell>
                <TableCell>Arrival Date Scheduled</TableCell>
                <TableCell>Arrival Date Actual</TableCell>
                <TableCell>Ship Date Scheduled</TableCell>
                <TableCell>Ship Date Actual</TableCell>
                <TableCell>Scheduled Installation Date</TableCell>
                <TableCell>Installation Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                // console.log('item photo', item.photos),
                <TableRow key={item.item_id}>
                  <TableCell>
                    <NestedModal projects={projects} data={item} setUpdatedItems={setUpdatedItems} setDeletedItems={setDeletedItem} />
                  </TableCell>
                  <TableCell component="th" scope="row">{item.item_id}</TableCell>
                  <TableCell>{item.item_name || ''}</TableCell>
                  <TableCell>{getProjectName(item.project_id, projects) || ''}</TableCell> {/* Changed from Project ID */}
                  <TableCell>{getClientName(item.client_id, projects) || ''}</TableCell> {/* Changed from Client ID */}
                  <TableCell>{item.item_type || ''}</TableCell>
                  <TableCell>{item.item_number || ''}</TableCell>
                  <TableCell>{item.condition || ''}</TableCell>
                  <TableCell>{item.item_notes || ''}</TableCell>
                  <TableCell>{item.damage_notes || ''}</TableCell>
                  <TableCell>{item.location || ''}</TableCell>
                  <TableCell>{item.inspection_date || ''}</TableCell>
                  <TableCell>{item.inspector || ''}</TableCell>
                  <TableCell>
                    {item.photos && item.photos.length > 0 && (
                      console.log("item.photos: ", item.photos),
                      <Button onClick={() => handleOpenModal(item.photos)}>View Photos</Button>
                    )}
                  </TableCell>
                  <TableCell>{item.manufacturer || ''}</TableCell>
                  <TableCell>{item.dimensions || ''}</TableCell>
                  <TableCell>{item.carrier || ''}</TableCell>
                  <TableCell>{item.tracking_number || ''}</TableCell>
                  <TableCell>{item.arrival_date_scheduled || ''}</TableCell>
                  <TableCell>{item.arrival_date_actual || ''}</TableCell>
                  <TableCell>{item.ship_date_scheduled || ''}</TableCell>
                  <TableCell>{item.ship_date_actual || ''}</TableCell>
                  <TableCell>{item.scheduled_installation_date || ''}</TableCell>
                  <TableCell>{item.installation_date || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

function renderPhotos(photos) {
  if (!photos || photos.length === 0) return 'None';

  try {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.map((photo, index) => (
          <Card key={index} style={{ margin: '5px' }}>
            <CardMedia
              component="img"
              height="100"
              image={photo.dataUrl}
              alt={`Photo ${index}`}
            />
          </Card>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error rendering photos:', error.message);
    return 'Invalid photo format';
  }
}


