import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

const getBlog = async (id) => {
  const request = await axios.get(`${baseUrl}/${id}`);
  return request.data;
};

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const update = async (id, blogToUpdate) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.put(`${baseUrl}/${id}`, blogToUpdate, config);
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  };

  const request = await axios.delete(`${baseUrl}/${id}`, config);
  return request.data;
};


export default { getAll, getBlog, setToken, create, update, remove };