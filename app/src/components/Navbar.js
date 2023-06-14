import React from "react";
import { Nav, NavLink, NavLogOut, NavMenu } from "./NavbarElements";
import {useNavigate, useLocation} from 'react-router-dom';
import '../styles/styles.css';

const Navbar = () => {
	const navigate = useNavigate();

	const location = useLocation();

	// Check if the current route matches any of the routes where the Navbar should be hidden
	const hideNavbar = ['/admin', '/admin/login', '/admin/approved', '/admin/rejected'].includes(location.pathname);

	const Auth = () => {
		return(
		<>
			<NavLink to="/login" activeStyle>
				Log In
			</NavLink>
			<NavLink to="/signup" activeStyle>
				Sign Up
			</NavLink>
		</>);
	}
	
	const Profile = () => {
		return(
		<>
			<NavLink to="/created-projects" activeStyle>
				Profile
			</NavLink>
			<NavLogOut onClick={logout}>
				Log out
			</NavLogOut>
		</>);
	}
	
	const logout = () => {
		sessionStorage.removeItem('uid');
		if(sessionStorage.getItem('adminloggedin')){
			sessionStorage.removeItem('adminloggedin')
		}
		navigate('/');
	}

	return (
		<>
		<Nav>
			<NavMenu>
			<NavLink className='title' to="/">
				LETSFUND
			</NavLink>
			{!hideNavbar ? 
				(<>
					<NavLink to="/explore" activeStyle>
						Explore
					</NavLink>
					<NavLink to="/start-a-project" activeStyle>
						Start a project
					</NavLink>
					{sessionStorage.getItem('uid')? (<Profile />): (<Auth />)}
				</>):
				(<>
					<NavLink to='/admin' activeStyle>
						Pending approval
					</NavLink>
					<NavLink onClick={() => window.location.replace('/admin/approved')} activeStyle>
						Approved
					</NavLink>
					<NavLink onClick={() => window.location.replace('/admin/rejected')} activeStyle>
						Rejected
					</NavLink>
					<NavLogOut onClick={logout}>
						Log out
					</NavLogOut>
				</>)
			}
			</NavMenu>
			
		</Nav>
		</>
	);
};

export default Navbar;
