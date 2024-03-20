import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import logo from '../images/warehouse.jpg'
import logout from '../images/logout.png'
import { supabase } from "../lib/helper/supabaseClient";



const NavContainer = styled.div`
    width: 100%;
    height: 100px;
    background-color: #1a1a1a;
    display: flex;
    flex-direction: row;

`
const Icon = styled.div`
    width: 250px;
    height: 100px;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    img {
        width: 100px;
        height: 100px;
    }
`

const Logout = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #d1d1d1;
    position: fixed;
    right: 10px;
    top: 10px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-color: white;
    img {
        width: 30px;
        height: 30px;
        background-color: white;
    }
    :hover {
        cursor: pointer;
    }
`


export default function NavBar() {

    async function handleLogout() {
        await supabase.auth.signOut({ scope: 'local'})
      }

    return (
        <>
            <NavContainer>
                <Icon>
                    <img src={logo} alt='Logo' />
                </Icon>
                <Logout onClick={handleLogout}><img src={logout}/></Logout>
            </NavContainer>
        </>
    )
}