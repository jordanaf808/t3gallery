// import Link from "next/link";

import Image from "next/image";
import { db } from "~/server/db";

const mockURLs = [
  "https://sgz4kbejt6.ufs.sh/f/DJeyGlYaJNrUNxDIuDJnlCmP2qUVp5sXx8Mwa3HdkoW4buzj",
  "https://sgz4kbejt6.ufs.sh/f/DJeyGlYaJNrUaGLITZNQ3UhnLt0VpbTscfvOY79zJFkeyi2r",
  "https://sgz4kbejt6.ufs.sh/f/DJeyGlYaJNrUDJmuW8CaJNrURQu8ag7mfqn2dAZ0VksyTE1B",
  "https://sgz4kbejt6.ufs.sh/f/DJeyGlYaJNrUQldLa7Y0LmJ2hxIkauEGdpCbBtjS5FUePci7",
];

const mockImages = mockURLs.map((url, index) => ({
  id: index + 1,
  url,
}));

export default async function HomePage() {
  const posts = await db.query.posts.findMany();
  console.log("//// POSTS: ", posts);

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {(!posts || posts.length < 1) && <h1>No Posts Available...</h1>}
        {posts &&
          posts.length > 0 &&
          posts.map((post) => <div key={post.id}>{post.name}</div>)}
        {[...mockImages, ...mockImages, ...mockImages].map((image, index) => (
          <div key={image.id + "-" + index} className="w-48">
            <img
              src={image.url}
              width={400}
              height={300}
              alt={`image-${image.id}-${index}`}
            />
          </div>
        ))}
      </div>
      Hello (Gallery in progress...)
    </main>
  );
}
