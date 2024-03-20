import { useState, useEffect } from 'react'
import { supabase } from "./lib/helper/supabaseClient";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import ItemModal from './components/ItemModal'
import ItemsTable from './components/ItemsTable'
import Dashboard from './Dashboard';


async function getInfo() {
  {/*just for testing purposes rn, hard coded item_id*/ }
  const { info, error } = await supabase
    .from('items')
    .select('*')
    .eq('item_id', '2c4bc8b7-8bc6-4b6f-95fa-059c866a869f')
  return info

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
        <Dashboard />
      </>
    )
  }
}