import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    });

    setNewBlog({ title: '', author: '', url: '' });
  };

  const handleTitleChange = (event) => {
    setNewBlog({ ...newBlog, title: event.target.value });
  };

  const handleAuthorChange = (event) => {
    setNewBlog({ ...newBlog, author: event.target.value });
  };

  const handleUrlChange = (event) => {
    setNewBlog({ ...newBlog, url: event.target.value });
  };

  return (
    <form onSubmit={addBlog} className='formSelector'>
      <div>
      Title: <input
          value={newBlog.title}
          onChange={handleTitleChange}
          id='title-input'
        />
      </div>
      <div>
      Author: <input
          value={newBlog.author}
          onChange={handleAuthorChange}
          id='author-input'
        />
      </div>
      <div>
      URL: <input
          value={newBlog.url}
          onChange={handleUrlChange}
          id='url-input'
        />
      </div>
      <button id='create-button' type="submit">Create</button>
    </form>
  );
};

export default BlogForm;