package com.jobportal.dto;

import com.jobportal.entity.Applicant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantDTO {
    private Long applicantId;
    private String name;
    private String email;
    private Long phone;
    private String website;
    private String resume;
    private String coverLetter;
    private LocalDateTime timestamp;
    private ApplicationStatus applicationStatus;
    private LocalDateTime interviewTime;
    private Integer matchScore;
    private String aiExplanation;
    private List<String> requiredSkills;
    private List<String> candidateSkills;

    // Additional context fields for flattened API responses
    private Long jobId;
    private String jobTitle;
    private String company;

    public Applicant toEntity(){
        return new Applicant(this.applicantId, this.name, this.email, this.phone, this.website,
                this.resume != null ? Base64.getDecoder().decode(this.resume) : null, this.coverLetter, this.timestamp,
                this.applicationStatus, this.interviewTime, this.matchScore, this.aiExplanation,
                this.requiredSkills, this.candidateSkills, null);
    }
}
