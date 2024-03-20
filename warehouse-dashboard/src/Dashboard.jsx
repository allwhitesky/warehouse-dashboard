import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'
import ClientsTable from './components/ClientsTable'
import ProjectsTable from './components/ProjectsTable' // Import the ProjectsTable component
import ItemsTable from './components/ItemsTable' // Import the ItemsTable component

export default function Dashboard() {
    const [current_project, setCurrentProject] = useState(null);
    const [current_client, setCurrentClient] = useState(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh'}}>
                <NavBar />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'between', gap: 105 }}> 
                <Sidebar setCurrentProject={setCurrentProject} setCurrentClient={setCurrentClient}/>
                <div style={{ flex: 1, overflowY: 'auto'}}>
                    {current_project ? (
                        <ItemsTable current_project={current_project} /> // Render ItemsTable when a project is selected
                    ) : current_client ? (
                        <ProjectsTable clientId={current_client} /> // Render ProjectsTable when a client is selected
                    ) : (
                        <ClientsTable setCurrentClient={setCurrentClient} /> // Render ClientsTable by default
                    )}
                </div>
            </div>
        </div>
    )
}
