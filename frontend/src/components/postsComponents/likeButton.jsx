
import React, { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import postService from "../../services/postService";

const LikeButton = ({ postId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      const res = await postService.likePost(postId);
      if (res?.likes !== undefined) {
        setLikes(res.likes);
      } else {
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Failed to update like", error);
    }
  };

  return (
    <div
      onClick={handleLike}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
    >
      {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="action" />}
      <span style={{ marginLeft: 6 }}>{likes}</span>
    </div>
  );
};

export default LikeButton;
