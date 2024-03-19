import { Link, NavLink, Outlet, useParams, useSearchParams, useRouteError } from 'react-router-dom'


export function Root(props) {
    const { children } = props
    return (
        <>
            <div>Star Wars</div>
            <nav>
                
                <NavLink to="/people"><div className="navItem">People</div></NavLink>
                <NavLink to="/films"><div className="navItem">Films</div></NavLink>
                <NavLink to="/planets"><div className="navItem">Planets</div></NavLink>
            </nav>
            {children || <Outlet />}
        </>
    )
}