package com.jobportal.api;

import com.jobportal.dto.*;
import com.jobportal.exception.JobPortalExceeption;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@Validated
@RequestMapping("/jobs")
public class JobAPI {
    @Autowired
    private JobService jobService;

    @PostMapping("/post")
    public ResponseEntity<JobDTO> postJob(@RequestBody @Valid JobDTO jobDTO) throws JobPortalExceeption {
        return new ResponseEntity<>(jobService.postJob(jobDTO), HttpStatus.CREATED);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<JobDTO>> getProfile() throws JobPortalExceeption {
        return new ResponseEntity<>(jobService.getAllJobs(), HttpStatus.OK);

    }

    @GetMapping("/get-all-with-expired")
    public ResponseEntity<List<JobDTO>> getAllJobsIncludingExpired() throws JobPortalExceeption {
        return new ResponseEntity<>(jobService.getAllJobsIncludingExpired(), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<JobDTO> getProfile(@PathVariable Long id) throws JobPortalExceeption {
        return new ResponseEntity<>(jobService.getJob(id), HttpStatus.OK);

    }

    @PostMapping("/apply/{id}")
    public ResponseEntity<ResponseDTO> applyJob(@PathVariable Long id, @RequestBody ApplicantDTO applicantDTO) throws JobPortalExceeption {
        jobService.applyJob(id, applicantDTO);
        return new ResponseEntity<>(new ResponseDTO("applied successfully"), HttpStatus.OK);
    }

    @GetMapping("/posted-by/{id}")
    public ResponseEntity<List<JobDTO>> getJobPostedBy(@PathVariable Long id) throws JobPortalExceeption {
        return new ResponseEntity<>(jobService.getJobsPostedBy(id), HttpStatus.OK);
    }

    @PostMapping("/change-app-status")
    public ResponseEntity<ResponseDTO> changeAppStatus(@RequestBody Application application) throws JobPortalExceeption {
//        System.out.println("application status"+application.toString());
        jobService.changeAppStatus(application);
        return new ResponseEntity<>(new ResponseDTO("Application status changed successfully"), HttpStatus.OK);
    }

    @PostMapping("/analyze-resume/{jobId}/{applicantId}")
    public ResponseEntity<ApplicantDTO> analyzeResume(@PathVariable Long jobId, @PathVariable Long applicantId)
            throws JobPortalExceeption {
        return new ResponseEntity<>(jobService.analyzeResume(jobId, applicantId), HttpStatus.OK);
    }

    @GetMapping("/{id}/applicants/filter")
    public ResponseEntity<Object> getApplicantsFiltered(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer matchScore,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws JobPortalExceeption {
        return new ResponseEntity<>(jobService.getApplicantsFiltered(id, status, matchScore, page, size),
                HttpStatus.OK);
    }

    @GetMapping("/employer/{employerId}/applicants")
    public ResponseEntity<List<ApplicantDTO>> getApplicantsByEmployer(
            @PathVariable Long employerId,
            @RequestParam(required = false) List<String> status) throws JobPortalExceeption {
        return new ResponseEntity<>(jobService.getApplicantsByEmployer(employerId, status), HttpStatus.OK);
    }
}
