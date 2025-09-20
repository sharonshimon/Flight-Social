import { useState } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

const LikeButton = ({ initialLikes = 0 }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const toggleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="item" onClick={toggleLike}>
      {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
      {likes} Likes
    </div>
  );
};

export default LikeButton;
