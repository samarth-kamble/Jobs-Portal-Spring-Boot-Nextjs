package com.jobportal.api;

import com.jobportal.dto.ProfileDto;
import com.jobportal.dto.Resume;
import com.jobportal.exception.JobPortalExceeption;
import com.jobportal.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@Validated
@RequestMapping("/profiles")
public class ProfileAPI {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/get/{id}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable Long id) throws JobPortalExceeption {
        return new ResponseEntity<>(profileService.getProfile(id), HttpStatus.OK);

    }

    @GetMapping("/getall")
    public ResponseEntity<List<ProfileDto>> getAllProfile() throws JobPortalExceeption {
        return new ResponseEntity<>(profileService.getAllProfile(), HttpStatus.OK);

    }


    @PutMapping("/update")
    public ResponseEntity<ProfileDto> updateProfile(@RequestBody ProfileDto profileDto) throws JobPortalExceeption {

        return new ResponseEntity<>(profileService.updateProfile(profileDto), HttpStatus.OK);

    }

    @PostMapping("/{id}/resumes")
    public ResponseEntity<ProfileDto> addResume(@PathVariable Long id, @RequestBody Resume resume)
            throws JobPortalExceeption {
        return new ResponseEntity<>(profileService.addResume(id, resume), HttpStatus.OK);
    }

    @DeleteMapping("/{id}/resumes/{resumeName}")
    public ResponseEntity<ProfileDto> deleteResume(@PathVariable Long id, @PathVariable String resumeName)
            throws JobPortalExceeption {
        return new ResponseEntity<>(profileService.deleteResume(id, resumeName), HttpStatus.OK);
    }
}
