import { useEffect, useState } from "react";
import Post from "../post";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:4000/post');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const posts = await response.json();
        setPosts(posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);  // Set loading to false regardless of success or failure
      }
    };
    
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {posts.length > 0 ? posts.map(post => (
        <Post key={post._id} {...post} />
      )) : <div>No posts available</div>}
    </>
  );
}
