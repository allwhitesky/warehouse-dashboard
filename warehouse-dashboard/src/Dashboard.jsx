import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'
import ClientsTable from './components/ClientsTable'
import ProjectsTable from './components/ProjectsTable' // Import the ProjectsTable component
import ItemsTable from './components/ItemsTable' // Import the ItemsTable component

export default function Dashboard() {
    const [current_project, setCurrentProject] = useState(null);
    const [current_client, setCurrentClient] = useState(null);

    useEffect(() => {
        setCurrentProject(null);
    }, [current_client]);

    return (
        <>
            <NavBar />
            <div style={{ height: '100vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '20px', justifyContent: 'space-between' }}>
                    <div style={{ flex: '0 0 auto', width: '250px', height: '100vh', overflowY: 'auto'  }}>
                        <Sidebar style={{}} setCurrentProject={setCurrentProject} setCurrentClient={setCurrentClient} />
                    </div>
                    <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
                        {current_project ? (
                            <ItemsTable current_project={current_project} />
                        ) : current_client ? (
                            <ProjectsTable clientId={current_client} />
                        ) : (
                            <ClientsTable setCurrentClient={setCurrentClient} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
