import * as React from 'react';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams, useRouteError } from "react-router-dom"
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { supabase } from '../lib/helper/supabaseClient';

const AddProjectButton = styled.button`
    background-color: #6e97f7;
    border-radius: 0px;
    color: white;
    margin: 2px;
    padding: 2px;
    font-size: 11px;
    border: black solid thin;

    
`
const NavItem = styled.li`
    padding-left: 0;
    text-align: left;
    margin: 10px;
    padding: 5px;
    :hover{
        cursor: pointer;
        border: 0px solid #333333;
        border-radius: 6px;
        background-color: #333333;
    }
`

const NavClient = styled.div`
    width: 200px;
    padding: 5px;
    border-radius: 6px;
    :hover{
        cursor: pointer;
        border: 0px solid #333333;
        border-radius: 6px;
        background-color: #333333;
    }
`
const NavProject = styled.div`
    width: 150px;
    padding: 5px;
    border-radius: 6px;
    :hover{
        cursor: pointer;
        border: 0px solid #333333;
        border-radius: 6px;
        background-color: #333333;
    }
`

const SideNavUl = styled.ul`
    position: absolute;
    top: 0;
    left: 0;
    width: 250px;
    padding-left: 10px;
    height: 100vh;
    margin-top: 100px;
    background:  #1a1a1a;
    box-sizing: border-box;
    border-top: 1px solid black;
    list-style-type: none;
    color: white;
    overflow-y: auto; /* Enable vertical scrolling */
`

const ClientIconImg = styled.img`
    height: 25px;
    width: 25px;
`

async function getProjects() {
    let { data: projects, error } = await supabase
        .from('projects')
        .select('*')
    return projects
}

async function getClients() {
    let { data: clients, error } = await supabase
        .from('clients')
        .select('*')
    return clients
}


async function getProjectsFromClient(props) {
    console.log("HERE", props)
    let { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', props)
    return projects
}


export function ProjectList({ clients, setCurrentProject, setCurrentClient }) {
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);

    async function handleClientClick(client) {
        if (selectedClients.includes(client)) {
            setSelectedClients(selectedClients.filter(c => c !== client));
            // Clear projects related to deselected client
            setProjects(prevProjects => prevProjects.filter(project => project.client_id !== client.client_id));
        } else {
            setSelectedClients([...selectedClients, client]);
            const clientProjects = await getProjectsFromClient(client.client_id);
            setProjects(prevProjects => [...prevProjects, ...clientProjects]);
            setCurrentClient(client.client_id); // Set the current client
            setSelectedClient(client.client_id)
        }
        setSelectedProject(null)
    }



    useEffect(() => {
        // Filter out projects related to deselected clients
        const filteredProjects = projects.filter(project =>
            selectedClients.some(client => client.client_id === project.client_id)
        );
        setProjects(filteredProjects);
    }, [selectedClients]);

    return (
        <nav>
            <SideNavUl>
                {clients.map(client => (
                    <NavItem onClick={() => setCurrentClient(client.client_id)} key={client.client_id}>
                        <div style={{ 
                            alignItems: 'flex-start',
                            display: 'flex', 
                            flexDirection: 'column' }}>
                            <NavClient style={{ 
                                display: 'flex', 
                                flexDirection: 'row', 
                                alignItems: 'center',
                                backgroundColor: selectedClient === client.client_id ? '#333333' : 'initial'
                                }}>
                                <PersonIcon style={{ marginRight: '5px' }} fontSize='medium' />
                                <a style={{ margin: '5px' }} onClick={() => handleClientClick(client)}>
                                    {client.client_name}
                                </a>
                            </NavClient>
                            {selectedClients.includes(client) && (
                                <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                                    {projects
                                        .filter(project => project.client_id === client.client_id)
                                        .map(project => (
                                            <NavProject key={project.project_id} style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                margin: '5px',
                                                backgroundColor: selectedProject === project.project_id ? '#333333' : 'initial', // Change background color based on selected project 
                                                }}>
                                                <ApartmentIcon style={{ marginRight: '5px' }} fontSize='small' />
                                                <a onClick={() => {
                                                        setCurrentProject(project.project_id);
                                                        setSelectedProject(project.project_id); // Set the selected project
                                                    }}
                                                >
                                                    {project.project_name}
                                                </a>
                                            </NavProject>
                                        ))}
                                </div>
                            )}
                        </div>
                    </NavItem>
                ))}
            </SideNavUl>
        </nav>
    );
}



export default function Sidebar({ setCurrentProject, setCurrentClient }) {
    console.log(setCurrentProject)
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);



    useEffect(() => {
        getProjects().then(data => {
            setProjects(data)
        })
        getClients().then(data => {
            setClients(data)
        })
    }, [])
    console.log(clients)
    return (

        <ProjectList clients={clients} projects={projects} setCurrentProject={setCurrentProject} setCurrentClient={setCurrentClient} />
    )
}