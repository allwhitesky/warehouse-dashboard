import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'
import ClientsTable from './components/ClientsTable'
import ItemTable from './components/ItemsTable'


export default function Dashboard() {




    return (
        <>
            <NavBar />

            <Sidebar />
        </>
    )
}