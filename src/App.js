import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [notifType, setNotifType] = useState('success');
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs( blogs );
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => {
    return (
      <Togglable buttonLabel='Login'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    );
  };

  const blogForm = () => (
    <Togglable buttonLabel="New Blog" ref={blogFormRef}>
      <BlogForm createBlog={addNewBlog}/>
    </Togglable>
  );

  const blogList = () =>  (
    blogs.map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        giveLike={() => giveLike(blog.id)}
        user={user}
        deleteBlog={() => deleteBlog(blog.id)}
      />
    )
  );

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username, password,
      });

      setNotifType('success');
      setNotificationMsg(
        `Successfully logged in! Welcome back, ${user.username}.`
      );
      setTimeout(() => {
        setNotificationMsg(null);
      }, 5000);

      window.localStorage.setItem(
        'loggedUser',
        JSON.stringify(user)
      );

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log('Error: ', exception);
      setNotifType('error');
      setNotificationMsg('Username or password incorrect!');
      setTimeout(() => {
        setNotificationMsg(null);
      }, 5000);
    }
  };

  const addNewBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const blog = await blogService.create(blogObject);
      blog.user = user;
      setBlogs(blogs.concat(blog));
      setNotifType('success');
      setNotificationMsg(
        `A new blog: "${blog.title}" by ${blog.author} added!`
      );
      setTimeout(() => {
        setNotificationMsg(null);
      }, 5000);
    } catch (error) {
      console.log(error.response.data.error);
      setNotifType('error');
      setNotificationMsg(error.response.data.error);
      setTimeout(() => {
        setNotificationMsg(null);
      }, 5000);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const blogToDelete = blogs.find(blog => blog.id === id);
      if (window.confirm(`Delete ${blogToDelete.title} by ${blogToDelete.author}`)) {
        await blogService.remove(blogToDelete.id);
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id));
        setNotifType('success');
        setNotificationMsg(
          `Blog "${blogToDelete.title}" successfully removed!`
        );
        setTimeout(() => {
          setNotificationMsg(null);
        }, 5000);
      }
    } catch (error) {
      console.log(error.response.data.error);
      setNotifType('error');
      setNotificationMsg(error.response.data.error);
      setTimeout(() => {
        setNotificationMsg(null);
      }, 5000);
    }
  };

  const giveLike = async (id) => {
    const blog = blogs.find(blog => blog.id === id);

    const changedBlog = {
      ...blog,
      likes: blog.likes + 1
    };

    const updatedBlog = await blogService.update(id, changedBlog);
    updatedBlog.user = blog.user;
    setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog));
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    window.localStorage.removeItem('loggedUser');
    blogService.setToken(null);
    setUser(null);
  };

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notificationMsg} type={notifType} />
      {!user && loginForm()}
      {user &&
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Log out</button>
          <h2>Create a new Blog:</h2>
          {blogForm()}
          <h2>Blogs</h2>
          {blogList()}
        </div>
      }
    </div>
  );
};

export default App;