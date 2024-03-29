import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
height: 60px;
display: flex;
justify-content: space-between;
/*padding: 0.2rem calc((100vw - 1000px) / 2);*/
z-index: 12;
box-shadow: 0 0.125rem 0.1875rem -0.125rem rgba(0,0,0,.2);
position: relative;
`;

export const NavLink = styled(Link)`
color: #808080;
display: flex;
align-items: center;
text-decoration: none;
padding: 0 1rem;
height: 100%;
cursor: pointer;

`;

/*&.active {
	color: #4d4dff;
}*/

export const NavLogOut = styled.div`
color: #808080;
display: flex;
align-items: center;
text-decoration: none;
padding: 0 1rem;
height: 100%;
cursor: pointer;
`;

export const NavMenu = styled.div`
display: flex;
align-items: center;
margin-right: -24px;
/* Second Nav */
/* margin-right: 24px; */
/* Third Nav */
/* width: 100vw;
white-space: nowrap; */
@media screen and (max-width: 768px) {
	display: none;
}
`;
