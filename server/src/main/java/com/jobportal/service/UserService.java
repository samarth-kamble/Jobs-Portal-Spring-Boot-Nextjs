package com.jobportal.service;

import com.jobportal.dto.AccountType;
import com.jobportal.dto.LoginDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.exception.JobPortalExceeption;

import java.util.List;

public interface UserService {

    UserDTO registerUser(UserDTO userDTO) throws JobPortalExceeption;

    UserDTO loginUser(LoginDTO loginDTO) throws JobPortalExceeption;

    public Boolean sendOtp(String email) throws Exception;

    public Boolean verifyOtp(String email, String otp) throws JobPortalExceeption;

    public ResponseDTO changePassword(LoginDTO loginDTO) throws JobPortalExceeption;

    List<UserDTO> getAllUsers();

    List<UserDTO> getUsersByAccountType(AccountType accountType);

    void deleteUser(Long id) throws JobPortalExceeption;

    UserDTO createAdmin(UserDTO userDTO) throws JobPortalExceeption;

    Boolean verifyEmail(String email, String otp) throws JobPortalExceeption;
}
