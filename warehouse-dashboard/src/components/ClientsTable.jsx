import { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import { supabase } from '../lib/helper/supabaseClient'

export default function BasicTable() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])

  useEffect(() => {
    async function fetchClients() {
      try {
        let { data, error } = await supabase
          .from('clients')
          .select('*')

        if (error) {
          throw error
        }
        setClients(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching clients:', error.message)
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Client ID</TableCell>
            <TableCell>Client Name</TableCell>
            <TableCell>Client Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.client_id}>
              <TableCell component="th" scope="row">{client.client_id}</TableCell>
              <TableCell>{client.client_name || ''}</TableCell>
              <TableCell>{client.client_email || ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
