import { useState } from 'react'
import './App.css'
import SignIn from './components/SignOn'
import SignUp from './components/SignUp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SignUp />
    </>
  )
}

export default App
