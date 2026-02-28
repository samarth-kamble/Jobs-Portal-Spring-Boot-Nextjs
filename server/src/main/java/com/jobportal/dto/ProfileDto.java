package com.jobportal.dto;

import com.jobportal.entity.Profile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDto {
    private Long id;
    private String name;
    private String email;
    private String jobTitle;
    private String company;
    private String location;
    private String about;
    private String picture;
    private Long totalExp;
    private List<String> skills;
    private List<Experience> experiences;
    private List<Certification> certifications;
    private List<Long> savedJobs;
    private List<Resume> resumes;

    public Profile toEntity(){
        List<Profile.ResumeEntry> resumeEntries = null;
        if (this.resumes != null) {
            resumeEntries = this.resumes.stream().map(r -> new Profile.ResumeEntry(
                    r.getName(),
                    r.getDocument() != null ? Base64.getDecoder().decode(r.getDocument()) : null,
                    r.getUploadedAt())).toList();
        }
        return new Profile(this.id, this.name, this.email, this.jobTitle, this.company, this.location, this.about,
                this.picture != null ? Base64.getDecoder().decode(this.picture) : null, this.totalExp,
                this.skills, this.experiences, this.certifications, this.savedJobs, resumeEntries);
    }
}
