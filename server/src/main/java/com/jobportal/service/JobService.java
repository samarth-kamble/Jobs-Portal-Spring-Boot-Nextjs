package com.jobportal.service;

import com.jobportal.dto.ApplicantDTO;
import com.jobportal.dto.Application;
import com.jobportal.dto.JobDTO;
import com.jobportal.exception.JobPortalExceeption;
import jakarta.validation.Valid;

import java.util.List;

public interface JobService {
    public JobDTO postJob(@Valid JobDTO jobDTO) throws JobPortalExceeption;

    public List<JobDTO> getAllJobs();

    public List<JobDTO> getAllJobsIncludingExpired();

    public JobDTO getJob(Long id) throws JobPortalExceeption;

    public void applyJob(Long id, ApplicantDTO applicantDTO) throws JobPortalExceeption;

    public List<JobDTO> getJobsPostedBy(Long id);

    public void changeAppStatus(Application application) throws JobPortalExceeption;

    public ApplicantDTO analyzeResume(Long jobId, Long applicantId) throws JobPortalExceeption;

    public Object getApplicantsFiltered(Long jobId, String status, Integer matchScore, int page, int size)
            throws JobPortalExceeption;

    public List<ApplicantDTO> getApplicantsByEmployer(Long employerId, List<String> status) throws JobPortalExceeption;

    public void deleteJob(Long id) throws JobPortalExceeption;
}
