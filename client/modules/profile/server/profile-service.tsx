import axios from 'axios'

const base_url = `${process.env.NEXT_PUBLIC_API_URL}/profiles`;

export const getProfile = async (id:any) => {
    return axios
      .get(`${base_url}/get/${id}`)
      .then((res) => res.data)
      .catch((error: any) => {
        throw error;
      });
}


export const updateProfile = async (profile:any) => {
    return axios
      .put(`${base_url}/update`, profile)
      .then((res) => res.data)
      .catch((error: any) => {
        throw error;
      });
}

export const getAllProfiles = async() => {
    return axios
      .get(`${base_url}/getall`)
      .then((res) => res.data)
      .catch((error: any) => {
        throw error;
      });
}
