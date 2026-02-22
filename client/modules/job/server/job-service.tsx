import axios from 'axios'

const base_url = `${process.env.NEXT_PUBLIC_API_URL}/jobs`

export const postJob = async (job:any) => {
    return axios.post(`${base_url}/post`, job)
            .then(res => {
                // console.log(res.data)
                return res.data})
            .catch(error => {throw error});
}

export const getAllJobs = async ()=> {
    return axios.get(`${base_url}/get-all`)
        .then(result => result.data)
        .catch(err => {throw err;});
}

export const getJob = async(id: any) =>{
    return axios.get(`${base_url}/get/${id}`)
        .then(result => result.data)
        .catch(error => {throw error;})
}

export const applyJob = async(id:any, applicant:any) => {
    return axios.post(`${base_url}/apply/${id}`, applicant)
        .then(result => result.data)
        .catch(error => {throw error;})
}

export const getJobPostedBy = async(id:any) => {
    return axios.get(`${base_url}/posted-by/${id}`)
        .then(result => result.data)
        .catch(error => {throw error;})
}

export const changeAppStatus = async(application:any) => {
    console.log(application)
    return axios.post(`${base_url}/change-app-status`, application)
        .then(result => result.data)
        .catch(error => {throw error;})
}
