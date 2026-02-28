package com.jobportal.service;

import com.jobportal.dto.ProfileDto;
import com.jobportal.dto.Resume;
import com.jobportal.exception.JobPortalExceeption;

import java.util.List;

public interface ProfileService {
    public Long createProfile(String email, String name, Long id) throws JobPortalExceeption;
    public ProfileDto getProfile(Long id) throws JobPortalExceeption;

    public ProfileDto updateProfile(ProfileDto profileDto) throws JobPortalExceeption;
    public List<ProfileDto> getAllProfile();

    public ProfileDto addResume(Long id, Resume resume) throws JobPortalExceeption;

    public ProfileDto deleteResume(Long id, String resumeName) throws JobPortalExceeption;
}
