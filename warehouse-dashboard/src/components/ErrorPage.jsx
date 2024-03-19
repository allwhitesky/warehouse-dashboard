import { useRouteError } from 'react-router-dom'


export function ErrorPage(){
    const error = useRouteError()
    console.error(error)
    return (
    <>
        <h1>404 Error</h1>
    </>
    )
}