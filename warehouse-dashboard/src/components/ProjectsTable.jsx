import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddProjectForm from './AddProjectForm';


import { supabase } from "../lib/helper/supabaseClient";

function formatColumnName(name) {
  // Remove underscores, separate words by a space, and capitalize every word
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function BasicTable({ clientId }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        let { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', clientId);

        if (projectError) {
          throw projectError;
        }

        const projectsWithNames = await Promise.all(projectData.map(async project => {
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('client_name')
            .eq('client_id', project.client_id)
            .single();

          if (clientError) {
            throw clientError;
          }

          return {
            ...project,
            project_name: project.project_name,
            client_name: clientData.client_name
          };
        }));

        setProjects(projectsWithNames);

        if (projectsWithNames.length > 0) {
          // Extract keys from the first object to use as table headings
          const cols = Object.keys(projectsWithNames[0]).map(formatColumnName);
          setColumns(cols);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
        setLoading(false);
      }
    }
    fetchProjects();
  }, [clientId]); // Fetch projects whenever clientId changes


  function getProjectName(projectId, projects) {
    const project = projects.find(project => project.project_id === projectId);
    return project ? project.project_name : 'Unknown';
  }
  
  function getClientName(clientId, projects) {
    const project = projects.find(project => project.client_id === clientId);
    return project ? project.client_name : 'Unknown';
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: '80%', margin: 'auto' }}>
        <AddProjectForm />
        <TableContainer component={Paper}>
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
              {columns.map((column, index) => (
                // Check if the column name contains 'id', and if so, skip rendering it
                !column.toLowerCase().includes('id') && (
                  <TableCell key={index}>{column}</TableCell>
                )
              ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={index}>
                  {columns.map((column, columnIndex) => (
                    <TableCell key={columnIndex}>
                      {/* Render project name and client name if column name matches */}
                      {column === 'Project Name' ? project.project_name :
                        column === 'Client Name' ? project.client_name :
                        project[columns[columnIndex].replace(/ /g, '_').toLowerCase()]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
