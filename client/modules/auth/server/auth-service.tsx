import axios from 'axios';

const base_url = `${process.env.NEXT_PUBLIC_API_URL}/users`;

export const refreshAccessToken = async (refreshToken: string) => {
  return axios
    .post(`${base_url}/refresh-token`, { refreshToken })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
