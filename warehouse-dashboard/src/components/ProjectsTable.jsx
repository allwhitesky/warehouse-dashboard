import { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://rvnfstjxuiwxvyzhlqmt.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function formatColumnName(name) {
  // Remove underscores, separate words by a space, and capitalize every word
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function BasicTable({ clientId }) {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [columns, setColumns] = useState([])

  useEffect(() => {
    async function fetchProjects() {
      try {
        let { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', clientId)

        if (error) {
          throw error
        }
        setProjects(data)
        if (data.length > 0) {
          // Extract keys from the first object to use as table headings
          const cols = Object.keys(data[0]).map(formatColumnName)
          setColumns(cols)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching projects:', error.message)
        setLoading(false)
      }
    }
    fetchProjects()
  }, [clientId]) // Fetch projects whenever clientId changes

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <div style={{ width: '80%', margin: 'auto'}}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow key={index}>
              {columns.map((column, columnIndex) => (
                <TableCell key={columnIndex}>{project[columns[columnIndex].replace(/ /g, '_').toLowerCase()]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </div>
  )
}
