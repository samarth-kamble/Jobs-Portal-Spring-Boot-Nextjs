package com.jobportal.api;

import com.jobportal.dto.AccountType;
import com.jobportal.dto.JobDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.exception.JobPortalExceeption;
import com.jobportal.service.JobService;
import com.jobportal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@Validated
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAPI {

    @Autowired
    private UserService userService;

    @Autowired
    private JobService jobService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(
            @RequestParam(required = false) String accountType) throws JobPortalExceeption {
        if (accountType != null && !accountType.isEmpty()) {
            AccountType type = AccountType.valueOf(accountType.toUpperCase());
            return new ResponseEntity<>(userService.getUsersByAccountType(type), HttpStatus.OK);
        }
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ResponseDTO> deleteUser(@PathVariable Long id) throws JobPortalExceeption {
        userService.deleteUser(id);
        return new ResponseEntity<>(new ResponseDTO("User deleted successfully."), HttpStatus.OK);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<UserDTO> createAdmin(@RequestBody @Valid UserDTO userDTO) throws JobPortalExceeption {
        return new ResponseEntity<>(userService.createAdmin(userDTO), HttpStatus.CREATED);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return new ResponseEntity<>(jobService.getAllJobs(), HttpStatus.OK);
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ResponseDTO> deleteJob(@PathVariable Long id) throws JobPortalExceeption {
        jobService.deleteJob(id);
        return new ResponseEntity<>(new ResponseDTO("Job deleted successfully."), HttpStatus.OK);
    }
}
