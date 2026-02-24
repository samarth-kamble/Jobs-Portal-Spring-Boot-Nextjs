import axios from 'axios';

const base_url = `${process.env.NEXT_PUBLIC_API_URL}/admin`;

export const getAllUsers = async (accountType?: string) => {
  let query = '';
  if (accountType) query = `?accountType=${accountType}`;
  return axios
    .get(`${base_url}/users${query}`)
    .then((res) => res.data)
    .catch((err) => { throw err; });
};

export const deleteUser = async (id: number) => {
  return axios
    .delete(`${base_url}/users/${id}`)
    .then((res) => res.data)
    .catch((err) => { throw err; });
};

export const createAdmin = async (data: { name: string; email: string; password: string }) => {
  return axios
    .post(`${base_url}/create-admin`, { ...data, accountType: 'ADMIN' })
    .then((res) => res.data)
    .catch((err) => { throw err; });
};

export const getAllJobsAdmin = async () => {
  return axios
    .get(`${base_url}/jobs`)
    .then((res) => res.data)
    .catch((err) => { throw err; });
};

export const deleteJobAdmin = async (id: number) => {
  return axios
    .delete(`${base_url}/jobs/${id}`)
    .then((res) => res.data)
    .catch((err) => { throw err; });
};
