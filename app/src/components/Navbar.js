import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";

const Navbar = () => {
return (
	<>
	<Nav>
		<NavMenu>
		<NavLink to="/" activeStyle>
			Explore
		</NavLink>
		<NavLink to="/start-a-project" activeStyle>
			Start a project
		</NavLink>
		<NavLink to="/login" activeStyle>
			Log In
		</NavLink>
		<NavLink to="/signup" activeStyle>
			Sign Up
		</NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;
