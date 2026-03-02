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

export const getAllJobsIncludingExpired = async () => {
  return axios
    .get(`${base_url}/get-all-with-expired`)
    .then((result) => result.data)
    .catch((err) => {
      throw err;
    });
};

export const getJob = async(id: any) =>{
    return axios.get(`${base_url}/get/${id}`)
        .then(result => result.data)
        .catch(error => {throw error;})
}

export const getApplicantsFiltered = async (
  jobId: any,
  status?: string,
  matchScore?: number,
  page: number = 0,
  size: number = 10,
) => {
  let query = `?page=${page}&size=${size}`;
  if (status) query += `&status=${status}`;
  if (matchScore) query += `&matchScore=${matchScore}`;

  return axios
    .get(`${base_url}/${jobId}/applicants/filter${query}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

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

export const analyzeResume = async (jobId: any, applicantId: any) => {
  return axios
    .post(`${base_url}/analyze-resume/${jobId}/${applicantId}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

export const getApplicantsByEmployer = async (
  employerId: any,
  status?: string | string[],
) => {
  let query = "";
  if (status) {
    if (Array.isArray(status)) {
      query = `?status=${status.join(",")}`;
    } else {
      query = `?status=${status}`;
    }
  }

  return axios
    .get(`${base_url}/employer/${employerId}/applicants${query}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};
