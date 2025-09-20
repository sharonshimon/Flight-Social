import React, { useState } from "react";

const SuggestionUser = ({ img, name }) => {
  const [status, setStatus] = useState(null);

  return (
    <div className="user">
      <div className="userInfo">
        <img src={img} alt="" />
        <span>{name}</span>
      </div>
      {status === null ? (
        <div className="buttons">
          <button onClick={() => setStatus("agree")}>Agree</button>
          <button onClick={() => setStatus("dismiss")}>Dismiss</button>
        </div>
      ) : status === "agree" ? (
        <div className="status green">
          new follower
        </div>
      ) : (
        <div className="status red">
          follow declined
        </div>
      )}
    </div>
  );
};

export default SuggestionUser;