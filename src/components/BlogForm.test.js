import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm createBlog={createBlog} />);

  const titleInput = container.querySelector('#title-input');
  const authorInput = container.querySelector('#author-input');
  const urlInput = container.querySelector('#url-input');
  const createButton = screen.getByText('Create');

  await user.type(titleInput, 'Testing Form');
  await user.type(authorInput, 'Juan Lischetti');
  await user.type(urlInput, 'http://www.testingreact.com');

  await user.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('Testing Form');
  expect(createBlog.mock.calls[0][0].author).toBe('Juan Lischetti');
  expect(createBlog.mock.calls[0][0].url).toBe('http://www.testingreact.com');
});