import React from "react";
import defaultImg from "../../assets/photoplaceholder.jpg";


const SuggestionUser = ({ img, name, isFollowing, onFollow }) => {
  return (
    <div className="user">
      <div className="userInfo">
        <img
          src={img || defaultImg}
          alt={name}
        />
        <span>{name}</span>
      </div>
      <div className="buttons">
        <button
          onClick={onFollow}
          style={{
            backgroundColor: isFollowing ? "#91c1fa" : "#1877f2",
            color: "white",
            cursor: "pointer",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            fontWeight: "bold",
          }}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default SuggestionUser;
