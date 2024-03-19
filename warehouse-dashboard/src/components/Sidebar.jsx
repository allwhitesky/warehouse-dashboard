import * as React from 'react';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams,useRouteError } from "react-router-dom"

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
    margin: 0px;
`

const SideNavUl = styled.ul`
    position: absolute;
    top: 0;
    left: 0;
    width: 250px;
    padding-left: 10px;
    height: calc(100vh - 3.5rem);
    margin-top: 3.5rem;
    background: #343a40;
    box-sizing: border-box;
    border-top: 1px solid black;
    list-style-type: none;
`
async function getProjects() {
    let { data: projects, error } = await supabase
        .from('projects')
        .select('*')
    return projects
}



export function ProjectList({projects}){
    console.log('projects', projects)
    const [isProjectListOpen, setIsProjectListOpen] = useState(false)
    return (
        <>
            <nav>
                <div>
                    <SideNavUl>
                        <NavItem>
                            <a>My Dashboard</a>
                        </NavItem>
                        <NavItem>
                            <a onClick={() => setIsProjectListOpen(!isProjectListOpen)}>My projects
                            <span style={{float : 'right',  paddingRight: '10px'}}>{isProjectListOpen ? '-' : '+'}</span>
                            </a>
                            {isProjectListOpen && (
                                <ul style={{ paddingLeft: '20px' }}>
                                    {projects.map(project => (
                                        <NavItem key={project.project_id}>
                                            {/* <NavLink to={project}>{project.project_name}</NavLink> */}
                                            <a>{project.project_name}</a>
                                        </NavItem>
                                    ))}
                                </ul>
                            )}
                        </NavItem>
                        <NavItem>
                            <a>Setting</a>
                        </NavItem>
                    </SideNavUl>
                </div>
            </nav>
        </>
    )
}

export default function Sidebar(){    
    const [projects, setProjects] = useState([]);
    useEffect(() => {
    getProjects().then(data => {
        setProjects(data)
    })
    }, [])

    return (

        <ProjectList projects={projects}/>
    )
}