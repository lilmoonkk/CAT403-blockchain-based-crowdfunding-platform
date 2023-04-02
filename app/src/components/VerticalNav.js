import React from "react";
import '../styles/styles.css';

const VerticalNav = () => {
  return (
    <ul className="vertical-nav">
      <li><a href="created-projects">Your created projects</a></li>
      <li><a href="contributions">Your pledged projects</a></li>
    </ul>
  );
}

export default VerticalNav;