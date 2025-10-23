import React from "react";

const SuggestionUser = ({ img, name, isFollowing, onFollow }) => {
  return (
    <div className="user">
      <div className="userInfo">
        <img
          src={img || "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="}
          alt={name}
        />
        <span>{name}</span>
      </div>
      <div className="buttons">
        <button
          onClick={onFollow}
          style={{
            backgroundColor: isFollowing ? "gray" : "#1877f2",
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
