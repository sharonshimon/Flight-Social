import React from "react";
import Posts from "../../components/postsComponents/Posts";
import Canvas from "../../components/Canvas/Canvas";

// demo only: small canvas above the feed for sketches
export default function Feed() {
  return (
    <>
      <Posts count={10} />
      <Canvas />
    </>
  );
}