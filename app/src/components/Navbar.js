import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";

const Navbar = () => {
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
	</>);
}

export default Navbar;
