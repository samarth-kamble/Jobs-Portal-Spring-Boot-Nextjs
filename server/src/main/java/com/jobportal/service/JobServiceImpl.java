package com.jobportal.service;

import com.jobportal.dto.*;
import com.jobportal.entity.Applicant;
import com.jobportal.entity.Job;
import com.jobportal.exception.JobPortalExceeption;
import com.jobportal.repository.JobRepository;
import com.jobportal.utility.Utilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.repository.UserRepository;
import com.jobportal.entity.User;
import com.jobportal.utility.Data;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service("jobService")
public class JobServiceImpl implements JobService{
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CVParserService cvParserService;

    @Autowired
    private AIService aiService;

    @Override
    public JobDTO postJob(JobDTO jobDTO) throws JobPortalExceeption {

        if(jobDTO.getId() == null || jobDTO.getId() == 0){
            jobDTO.setId(Utilities.getNextSequence("jobs"));
            jobDTO.setPostTime(LocalDateTime.now());
            NotificationDto notificationDto = new NotificationDto();
            notificationDto.setAction("Job Posted");
            notificationDto.setMessage("Job posted successfully for "+jobDTO.getJobTitle());
            notificationDto.setUserId(jobDTO.getPostedBy()  );
            notificationDto.setRoute("/posted-jobs/"+jobDTO.getId());

            try {
                notificationService.sendNotification(notificationDto);

            } catch (JobPortalExceeption e) {
                throw new RuntimeException(e);
            }}
        else{
            Job job = jobRepository.findById(jobDTO.getId()).orElseThrow(()-> new JobPortalExceeption("JOB_NOT_FOUND"));
            if(job.getJobStatus().equals(JobStatus.DRAFT) || jobDTO.getJobStatus().equals(JobStatus.CLOSED) )
                jobDTO.setPostTime(LocalDateTime.now());
        }
        return jobRepository.save(jobDTO.toEntity()).toDTO();
    }

    @Override
    public List<JobDTO> getAllJobs() {
        return jobRepository.findAll().stream()
                .filter(job -> job.getEndDate() == null || !job.getEndDate().isBefore(LocalDateTime.now()))
                .map(Job::toDTO)
                .toList();
    }

    @Override
    public JobDTO getJob(Long id) throws JobPortalExceeption {
        return jobRepository.findById(id).orElseThrow(()-> new JobPortalExceeption("JOB_NOT_FOUND")).toDTO();
    }

    @Override
    public void applyJob(Long id, ApplicantDTO applicantDTO) throws JobPortalExceeption {
        Job job = jobRepository.findById(id).orElseThrow(()-> new JobPortalExceeption("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants();
        if (applicants == null) applicants = new ArrayList<>();

        if(applicants.stream().filter((x) -> x.getApplicantId() ==applicantDTO.getApplicantId()).toList().size() > 0) throw new JobPortalExceeption("JOB_APPLIED_ALREADY");

        applicantDTO.setApplicationStatus(ApplicationStatus.APPLIED);
        applicantDTO.setMatchScore(null); // Score will be hydrated later via manual AI scan
        applicantDTO.setAiExplanation(null);

        applicants.add(applicantDTO.toEntity());
        job.setApplicants(applicants);
        jobRepository.save(job);

        // Notify Employer
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setAction("New Applicant");
        notificationDto.setMessage(applicantDTO.getName() + " applied for " + job.getJobTitle());
        notificationDto.setUserId(job.getPostedBy());
        notificationDto.setRoute("/employer/jobs/" + job.getId() + "/analytics");

        try {
            notificationService.sendNotification(notificationDto);
        } catch (JobPortalExceeption e) {
            System.out.println("Error sending application notification: " + e.getMessage());
        }
    }

    @Override
    public ApplicantDTO analyzeResume(Long jobId, Long applicantId) throws JobPortalExceeption {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new JobPortalExceeption("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants();
        if (applicants == null || applicants.isEmpty())
            throw new JobPortalExceeption("NO_APPLICANTS_FOUND");

        Applicant targetApplicant = applicants.stream()
                .filter(a -> a.getApplicantId().equals(applicantId))
                .findFirst()
                .orElseThrow(() -> new JobPortalExceeption("APPLICANT_NOT_FOUND"));

        String resumeText = cvParserService.extractTextFromPdfBytes(targetApplicant.getResume());
        String aiResponse = aiService.analyzeResume(resumeText, job.getJobTitle() + "\\n" + job.getDescription());

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(aiResponse);
            int score = node.has("matchScore") ? node.get("matchScore").asInt() : 0;
            String explanation = node.has("aiExplanation") ? node.get("aiExplanation").asText()
                    : "No explanation provided.";

            List<String> reqSkills = new ArrayList<>();
            if (node.has("requiredSkills")) {
                node.get("requiredSkills").forEach(s -> reqSkills.add(s.asText()));
            }

            List<String> candSkills = new ArrayList<>();
            if (node.has("candidateSkills")) {
                node.get("candidateSkills").forEach(s -> candSkills.add(s.asText()));
            }

            targetApplicant.setMatchScore(score);
            targetApplicant.setAiExplanation(explanation);
            targetApplicant.setRequiredSkills(reqSkills);
            targetApplicant.setCandidateSkills(candSkills);
        } catch (Exception e) {
            targetApplicant.setMatchScore(0);
            targetApplicant.setAiExplanation("Error parsing AI response: " + e.getMessage() + " | Raw: " + aiResponse);
            targetApplicant.setRequiredSkills(new ArrayList<>());
            targetApplicant.setCandidateSkills(new ArrayList<>());
        }

        jobRepository.save(job);
        return targetApplicant.toDTO();
    }

    @Override
    public List<JobDTO> getJobsPostedBy(Long id) {
        return jobRepository.findByPostedBy(id).stream().map((x) -> x.toDTO()).toList();
    }

    @Override
    public void changeAppStatus(Application application) throws JobPortalExceeption {
        Job job = jobRepository.findById(application.getId()).orElseThrow(()-> new JobPortalExceeption("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants().stream().map((x) -> {
            if (application.getApplicantId() == x.getApplicantId()) {
                x.setApplicationStatus(application.getApplicationStatus());

                String action = "";
                String message = "";
                String emailMessage = "";

                if(application.getApplicationStatus().equals(ApplicationStatus.INTERVIEWING)) {
                    x.setInterviewTime(application.getInterviewTime());
                    action = "Interview Scheduled";
                    message = "Interview Scheduled for job: " + job.getJobTitle();
                    emailMessage = "Congratulations! You have been selected for an interview for the position of "
                            + job.getJobTitle() + " at " + job.getCompany()
                            + ". We will be in touch shortly with more details.";
                } else if (application.getApplicationStatus().equals(ApplicationStatus.REJECTED)) {
                    action = "Application Update";
                    message = "Your application for " + job.getJobTitle() + " was not selected.";
                    emailMessage = "Thank you for your interest in " + job.getCompany()
                            + ". Unfortunately, we will not be moving forward with your application for the "
                            + job.getJobTitle() + " position at this time. We wish you the best in your job search.";
                } else if (application.getApplicationStatus().equals(ApplicationStatus.OFFERED)) {
                    action = "Offer Received";
                    message = "Congratulations! You received an offer for " + job.getJobTitle();
                    emailMessage = "Congratulations! We are thrilled to offer you the position of " + job.getJobTitle()
                            + " at " + job.getCompany() + ". Welcome to the team!";
                } else if (application.getApplicationStatus().equals(ApplicationStatus.APPLIED)) {
                    action = "Application Status Reset";
                    message = "Your application for " + job.getJobTitle() + " was reset to APPLIED.";
                }

                // Override with custom email message from employer if provided
                if (application.getEmailMessage() != null && !application.getEmailMessage().isBlank()) {
                    emailMessage = application.getEmailMessage();
                }

                if (!action.isEmpty()) {
                    NotificationDto notificationDto = new NotificationDto();
                    notificationDto.setAction(action);
                    notificationDto.setMessage(message);
                    notificationDto.setUserId(application.getApplicantId());
                    notificationDto.setRoute("/jhistory");

                    try {
                        notificationService.sendNotification(notificationDto);

                        // Send Email Notification
                        User user = userRepository.findById(application.getApplicantId()).orElse(null);
                        if (user != null) {
                            MimeMessage mm = mailSender.createMimeMessage();
                            MimeMessageHelper helper = new MimeMessageHelper(mm, true);
                            helper.setTo(user.getEmail());
                            helper.setSubject(action + " - " + job.getCompany());

                            String emailBody = Data.getApplicationStatusBody(
                                    user.getName(),
                                    job.getJobTitle(),
                                    job.getCompany(),
                                    application.getApplicationStatus().name(),
                                    emailMessage);
                            helper.setText(emailBody, true);
                            mailSender.send(mm);
                        }

                    } catch (Exception e) {
                        System.out.println("Error sending notification or email: " + e.getMessage());
                    }
                }
            }
            return  x;
        }).toList();
        job.setApplicants(applicants);
        jobRepository.save(job);

    }

    @Override
    public Object getApplicantsFiltered(Long jobId, String status, Integer matchScore, int page, int size)
            throws JobPortalExceeption {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new JobPortalExceeption("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants();
        if (applicants == null) {
            applicants = new ArrayList<>();
        }

        // Apply filters
        List<ApplicantDTO> filtered = applicants.stream()
                .filter(a -> {
                    boolean matchesStatus = true;
                    if (status != null && !status.trim().isEmpty()) {
                        matchesStatus = a.getApplicationStatus().name().equalsIgnoreCase(status);
                    }

                    boolean matchesScore = true;
                    if (matchScore != null) {
                        matchesScore = a.getMatchScore() != null && a.getMatchScore() >= matchScore;
                    }

                    return matchesStatus && matchesScore;
                })
                // Sort by applied date descending (assuming applicantId strictly increments
                // over time as proxy, or we can just reverse since newly applied are added to
                // end of list)
                .sorted((a1, a2) -> a2.getApplicantId().compareTo(a1.getApplicantId()))
                .map(Applicant::toDTO)
                .toList();

        // Apply pagination
        int totalElements = filtered.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int fromIndex = page * size;
        int MathMin = Math.min(fromIndex + size, totalElements);

        List<ApplicantDTO> content = new ArrayList<>();
        if (fromIndex < totalElements) {
            content = filtered.subList(fromIndex, MathMin);
        }

        // Create a custom paginated response map
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", content);
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", totalElements);
        response.put("totalPages", totalPages);

        return response;
    }

    @Override
    public List<ApplicantDTO> getApplicantsByEmployer(Long employerId, List<String> status) throws JobPortalExceeption {
        List<Job> jobs = jobRepository.findByPostedBy(employerId);
        List<ApplicantDTO> filteredApplicants = new ArrayList<>();

        for (Job job : jobs) {
            if (job.getApplicants() != null) {
                for (Applicant applicant : job.getApplicants()) {
                    // Check if applicant matches the status filter (if provided)
                    boolean matchesStatus = false;
                    if (status == null || status.isEmpty()) {
                        matchesStatus = true; // No filter, include all
                    } else {
                        for (String s : status) {
                            if (applicant.getApplicationStatus().name().equalsIgnoreCase(s)) {
                                matchesStatus = true;
                                break;
                            }
                        }
                    }

                    if (matchesStatus) {
                        ApplicantDTO dto = applicant.toDTO();
                        // Inject job context
                        dto.setJobId(job.getId());
                        dto.setJobTitle(job.getJobTitle());
                        dto.setCompany(job.getCompany());
                        filteredApplicants.add(dto);
                    }
                }
            }
        }

        return filteredApplicants;
    }

    @Override
    public void deleteJob(Long id) throws JobPortalExceeption {
        Job job = jobRepository.findById(id).orElseThrow(() -> new JobPortalExceeption("JOB_NOT_FOUND"));
        jobRepository.delete(job);
    }
}
