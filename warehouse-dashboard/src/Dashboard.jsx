import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'
import ClientsTable from './components/ClientsTable'
import ItemTable from './components/ItemsTable'


export default function Dashboard() {

    const [current_project, setCurrentProject] = useState(null);


    return (
        <>
            <NavBar />
            <Sidebar setCurrentProject={setCurrentProject} />
            {current_project ? <ItemTable current_project={current_project} /> : <div>NOTHING HERE</div>}
        </>
    )
}