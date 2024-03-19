import { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Card, CardMedia } from '@mui/material'

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://rvnfstjxuiwxvyzhlqmt.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

export default function BasicTable() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetchItems() {
      try {
        let { data, error } = await supabase
          .from('items')
          .select('*')

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
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Item ID</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Item Type</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Arrival Date Scheduled</TableCell>
            <TableCell>Inspection Date</TableCell>
            <TableCell>Inspector</TableCell>
            <TableCell>Project ID</TableCell>
            <TableCell>Client ID</TableCell>
            <TableCell>Photos</TableCell>
            <TableCell>Item Number</TableCell>
            <TableCell>Manufacturer</TableCell>
            <TableCell>Dimensions</TableCell>
            <TableCell>Carrier</TableCell>
            <TableCell>Tracking Number</TableCell>
            <TableCell>Arrival Date Actual</TableCell>
            <TableCell>Ship Date Scheduled</TableCell>
            <TableCell>Ship Date Actual</TableCell>
            <TableCell>Scheduled Installation Date</TableCell>
            <TableCell>Installation Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.item_id}>
              <TableCell component="th" scope="row">{item.item_id}</TableCell>
              <TableCell>{item.item_name || ''}</TableCell>
              <TableCell>{item.item_type || ''}</TableCell>
              <TableCell>{item.condition || ''}</TableCell>
              <TableCell>{item.location || ''}</TableCell>
              <TableCell>{item.arrival_date_scheduled || ''}</TableCell>
              <TableCell>{item.inspection_date || ''}</TableCell>
              <TableCell>{item.inspector || ''}</TableCell>
              <TableCell>{item.project_id || ''}</TableCell>
              <TableCell>{item.client_id || ''}</TableCell>
              <TableCell>{renderPhotos(item.photos) || 'None'}</TableCell>
              <TableCell>{item.item_number || ''}</TableCell>
              <TableCell>{item.manufacturer || ''}</TableCell>
              <TableCell>{item.dimensions || ''}</TableCell>
              <TableCell>{item.carrier || ''}</TableCell>
              <TableCell>{item.tracking_number || ''}</TableCell>
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
  )
}

function renderPhotos(photos) {
    if (!photos) return '';
  
    try {
      if (typeof photos === 'string') {
        return (
          <Card>
            <CardMedia
              component="img"
              height="100"
              image={photos}
              alt="Photo"
            />
          </Card>
        );
      } else {
        return 'Invalid photo format';
      }
    } catch (error) {
      console.error('Error rendering photos:', error.message);
      return '';
    }
  }