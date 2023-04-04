import React from "react";
import { Nav, NavLink, NavLogOut, NavMenu } from "./NavbarElements";
import {useNavigate} from 'react-router-dom';

const Navbar = () => {
	const navigate = useNavigate();

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
		navigate('/');
	}

	return (
		<>
		<Nav>
			<NavMenu>
			<NavLink to="/">
				LETSFUND
			</NavLink>
			<NavLink to="/explore" activeStyle>
				Explore
			</NavLink>
			<NavLink to="/start-a-project" activeStyle>
				Start a project
			</NavLink>
			{sessionStorage.getItem('uid')? (<Profile />): (<Auth />)}
			</NavMenu>
			
		</Nav>
		</>
	);
};

export default Navbar;
