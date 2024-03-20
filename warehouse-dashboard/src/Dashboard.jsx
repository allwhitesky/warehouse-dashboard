import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'
import ClientsTable from './components/ClientsTable'
import ItemTable from './components/ItemsTable'


export default function Dashboard() {

    const [current_project, setCurrentProject] = useState(null);


    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar setCurrentProject={setCurrentProject} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {current_project ? <ItemTable current_project={current_project} /> : <div>NOTHING HERE</div>}
                </div>
            </div>
        </div>
    )
}