import { useState } from 'react';

const Blog = ({ blog, giveLike, user, deleteBlog }) => {
  const [ showInfo, setShowInfo ] = useState(false);

  const toggleDisplay = () => {
    setShowInfo(!showInfo);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  if (showInfo) {
    return (
      <div style={blogStyle} className='blog'>
        <h2>{blog.title} <button onClick={toggleDisplay}>Hide</button></h2>
        <h4>Author: {blog.author}</h4>
        <h4>Likes: {blog.likes} <button className='likeButton' onClick={giveLike}>Give a like!</button></h4>
        <h4>URL: <a href={blog.url}>{blog.url}</a></h4>
        {blog.user.username}
        <div>{blog.user.username === user.username && <button id='deleteButton' onClick={deleteBlog}>Delete Blog</button>}</div>
      </div>
    );
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleDisplay}>View</button>
    </div>
  );
};

export default Blog;