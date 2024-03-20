import { useState, useEffect } from 'react'
import { supabase } from "./lib/helper/supabaseClient";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import ItemModal from './components/ItemModal'
import ItemsTable from './components/ItemsTable'
import ClientsTable from './components/ClientsTable'
import Sidebar from './components/Sidebar';
import ProjectsTable from './components/ProjectsTable';

const client_Id = '096eac8f-bc2a-4328-8087-5656d78c7f92'

async function getInfo() {
  {/*just for testing purposes rn, hard coded item_id*/ }
  const { info, error } = await supabase
    .from('items')
    .select('*')
    .eq('item_id', '2c4bc8b7-8bc6-4b6f-95fa-059c866a869f')
  return info

}

async function logout() {
  await supabase.auth.signOut({ scope: 'local'})
}

export default function App() {
  const [session, setSession] = useState(null)
  const [info, setInfo] = useState(null);
 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      console.log(
        'session',
        session
      )
     
      console.log(
        'userEmail',
        session.user.email
      )
    })
   

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    console.log(
      'session',
      session
    )
    getInfo().then(info => {
      setInfo(info);
    });

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />)
  }
  else {
    return (
      <>
        
        <Sidebar />
        <button onClick={logout}>Logout</button>
      </>
    )
  }
}