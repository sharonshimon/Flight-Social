import { useState } from "react";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setComments([...comments, text]);
    setText("");
  };

  return (
    <div className="comments">
      <div className="comment-list">
        {comments.map((c, index) => (
          <div key={index} className="comment">
            {c}
          </div>
        ))}
      </div>

      <form className="comment-input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Comment;
