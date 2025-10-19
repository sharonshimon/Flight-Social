import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Posts from "../../components/postsComponents/Posts";
import "./TagFeed.css";

export default function TagFeed() {
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [tag, setTag] = useState("");

    // שליפת ה-tag מה-URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tagParam = queryParams.get("tag");
        setTag(tagParam);
        if (tagParam) {
            fetchPostsByTag(tagParam);
        }
    }, [location.search]);

    // בקשת GET לשרת לפי תגית
    const fetchPostsByTag = async (tag) => {
        try {
            const response = await axios.get(`http://localhost:3000/posts/byTag/${tag}`);
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts by tag:", error);
        }
    };

    return (
        <div className="feed-bg">
            <div className="feed-content">
                <h1>#{tag} Posts</h1>
                <Posts posts={posts} />
            </div>
        </div>
    );
}
