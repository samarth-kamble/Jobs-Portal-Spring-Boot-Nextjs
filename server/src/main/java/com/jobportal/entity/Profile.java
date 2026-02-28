package com.jobportal.entity;

import com.jobportal.dto.Certification;
import com.jobportal.dto.Experience;
import com.jobportal.dto.ProfileDto;
import com.jobportal.dto.Resume;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "profiles")
public class Profile {
    @Id
    private Long id;
    private String name;
    private String email;
    private String jobTitle;
    private String company;
    private String location;
    private String about;
    private byte[] picture;
    private Long totalExp;
    private List<String> skills;
    private List<Experience> experiences;
    private List<Certification> certifications;
    private List<Long> savedJobs;
    private List<ResumeEntry> resumes;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResumeEntry {
        private String name;
        private byte[] document;
        private LocalDateTime uploadedAt;

        public Resume toDto() {
            return new Resume(
                    this.name,
                    this.document != null ? Base64.getEncoder().encodeToString(this.document) : null,
                    this.uploadedAt);
        }
    }

    public ProfileDto toDto() {
        List<Resume> resumeDtos = null;
        if (this.resumes != null) {
            resumeDtos = this.resumes.stream().map(ResumeEntry::toDto).toList();
        }
        return new ProfileDto(this.id, this.name, this.email, this.jobTitle, this.company, this.location, this.about,
                this.picture != null ? Base64.getEncoder().encodeToString(this.picture) : null, this.totalExp,
                this.skills, this.experiences, this.certifications, this.savedJobs, resumeDtos);
    }
}
