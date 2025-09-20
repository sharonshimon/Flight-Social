import React from "react";
import { NavLink } from "react-router-dom";

const LeftBarItem = ({ icon, name, path }) => {
  return (
    <NavLink
      to={path}                                // <-- e.g. "/messages"
      className={({ isActive }) =>
        `item ${isActive ? "item--active" : ""}`
      }
      title={name}
      aria-label={name}
    >
      <img src={icon} alt="" className="item__icon" />
      <span className="item__text">{name}</span>
    </NavLink>
  );
};

export default LeftBarItem;
