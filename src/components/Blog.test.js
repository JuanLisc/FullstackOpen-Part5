import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const user = userEvent.setup();

const blog = {
  title: 'Testing render',
  author: 'Juan Lischetti',
  url: 'http://www.testing.com',
  likes: 10,
  user: 'JuanLis'
};

test('Renders only title and author by default', () => {
  const { container } = render(<Blog blog={blog} />);

  const blogContent = container.querySelector('.blog');
  expect(blogContent).toBeDefined();
  expect(blogContent).toHaveTextContent(`${blog.title} ${blog.author}`);
});

test('URL and likes are also shown when detail button is clicked', async () => {
  const { container } = render(<Blog blog={blog} user={user}/>);

  const button = screen.getByText('View');
  await user.click(button);

  const blogContent = container.querySelector('.blog');
  expect(blogContent).toHaveTextContent(`${blog.url}`);
  expect(blogContent).toHaveTextContent(`${blog.likes}`);
});

test('If like button is clicked twice, the component is called twice', async () => {
  const mockHandler = jest.fn();

  render(<Blog blog={blog} user={user} giveLike={mockHandler} />);

  const viewButton = screen.getByText('View');
  await user.click(viewButton);

  const likeButton = screen.getByText('Give a like!');
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});