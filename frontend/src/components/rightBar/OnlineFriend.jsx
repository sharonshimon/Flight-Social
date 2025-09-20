import React from "react";

const OnlineFriend = ({ img, name }) => (
  <div className="user">
    <div className="userInfo">
      <img src={img} alt="" />
      <div className="online" />
      <span>{name}</span>
    </div>
  </div>
);

export default OnlineFriend;