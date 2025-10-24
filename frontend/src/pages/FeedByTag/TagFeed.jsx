import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import postService from "../../services/postService";
import Posts from "../../components/postsComponents/Posts";
import "./TagFeed.css";

export default function TagFeed() {
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [tag, setTag] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tagParam = queryParams.get("tag");
        setTag(tagParam);
        if (tagParam) {
            fetchPostsByTag(tagParam);
        }
    }, [location.search]);

    const fetchPostsByTag = async (tag) => {
        try {
            const data = await postService.getPostsByTag(tag);
            setPosts(data);
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
