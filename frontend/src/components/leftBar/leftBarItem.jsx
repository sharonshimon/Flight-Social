import React from "react";

const LeftBarItem = ({icon, name, path}) => (
    <div className="item">
        <img src={icon} alt="{path}" />
        <span>{name}</span>
        </div>
);
export default LeftBarItem;