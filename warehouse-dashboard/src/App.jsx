import { useState, useEffect } from 'react'
import './App.css'
import SignIn from './components/SignOn'
import SignUp from './components/SignUp'
import ItemModal from './components/ItemModal'

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://rvnfstjxuiwxvyzhlqmt.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)


async function getData() {
  {/*just for testing purposes rn, hard coded item_id*/ }
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('item_id', '2c4bc8b7-8bc6-4b6f-95fa-059c866a869f')
  return data

}

function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    getData().then(data => {
      setData(data);
    });
  }, []);
  console.log("THIS IS ITEM DATA", data)
  return (
    <>
      <SignUp />
      {data ? <ItemModal data={data[0]} /> : <></>}
    </>
  )
}

export default App
