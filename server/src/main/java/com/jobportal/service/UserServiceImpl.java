package com.jobportal.service;


import com.jobportal.dto.AccountType;
import com.jobportal.dto.LoginDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.entity.OTP;
import com.jobportal.entity.User;
import com.jobportal.exception.JobPortalExceeption;
import com.jobportal.repository.OTPRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.utility.Data;
import com.jobportal.utility.Utilities;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.jobportal.security.JwtService;

@Service(value = "userService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OTPRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtService jwtService;

    @Override
    public UserDTO registerUser(UserDTO userDTO) throws JobPortalExceeption {
        Optional<User> optional =  userRepository.findByEmail(userDTO.getEmail());
        if(optional.isPresent()) {
            throw new JobPortalExceeption("USER_FOUND");
        }
        userDTO.setId(Utilities.getNextSequence("users"));
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userDTO.setEmailVerified(false);
        User user = userDTO.toEntity();
        user = userRepository.save(user);
        profileService.createProfile(userDTO.getEmail(), userDTO.getName(), user.getId());

        // Auto-send OTP for email verification
        try {
            sendOtp(userDTO.getEmail());
        } catch (Exception e) {
            System.out.println("Failed to send verification OTP: " + e.getMessage());
        }

        UserDTO result = user.toDTO();
        result.setPassword(null);
        return result;
    }

    @Override
    public UserDTO loginUser(LoginDTO loginDTO) throws JobPortalExceeption {
        User user = userRepository.findByEmail(loginDTO.getEmail()).orElseThrow(()->new JobPortalExceeption("USER_NOT_FOUND"));

        if(!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) throw new JobPortalExceeption("INVALID_CREDENTIALS");

        if (user.getEmailVerified() == null || !user.getEmailVerified()) {
            throw new JobPortalExceeption("EMAIL_NOT_VERIFIED");
        }

        UserDTO userDTO = user.toDTO();
        userDTO.setPassword(null);
        userDTO.setToken(jwtService.generateToken(user));
        userDTO.setRefreshToken(jwtService.generateRefreshToken(user));
        return userDTO;
    }

    @Override
    public Boolean sendOtp(String email) throws Exception {
        User user = userRepository.findByEmail(email).orElseThrow(()->new JobPortalExceeption("USER_NOT_FOUND"));

        MimeMessage mm = mailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mm,true);

        message.setTo(email);
        message.setSubject("Your OTP Code");

        String genOtp = Utilities.generateOTP();

        OTP otp = new OTP(email, genOtp, LocalDateTime.now());

        otpRepository.save(otp);

        message.setText(Data.getMessageBody(user.getName(), genOtp), true);

        mailSender.send(mm);

        return true;
    }

    @Override
    public Boolean verifyOtp(String email, String otp) throws JobPortalExceeption {
        OTP otpEntity = otpRepository.findById(email).orElseThrow(()-> new JobPortalExceeption("OTP_NOT_FOUND"));

        if(!otpEntity.getOtpCode().equals(otp)) throw new JobPortalExceeption("OTP_INCORRECT");
        return true;
    }

    @Override
    public ResponseDTO changePassword(LoginDTO loginDTO) throws JobPortalExceeption {
        User user= userRepository.findByEmail(loginDTO.getEmail()).orElseThrow(()-> new JobPortalExceeption("USER_NOT_FOUND"));

        user.setPassword(passwordEncoder.encode(loginDTO.getPassword()));

        userRepository.save(user);

        return new ResponseDTO("Password changed successfully");
    }

    @Scheduled(fixedRate = 60000) // to execute every 1 minute
    public void removeExpiredOTPs(){
        LocalDateTime expiry = LocalDateTime.now().minusMinutes(5);

        List<OTP> expiredOTPs = otpRepository.findByCreationDateBefore(expiry);

        if(!expiredOTPs.isEmpty()){
            otpRepository.deleteAll(expiredOTPs);
            System.out.println("removed: "+expiredOTPs.size()+" expired OTPs");
        }
    }

    @Override
    public Boolean verifyEmail(String email, String otp) throws JobPortalExceeption {
        OTP otpEntity = otpRepository.findById(email).orElseThrow(() -> new JobPortalExceeption("OTP_NOT_FOUND"));

        if (!otpEntity.getOtpCode().equals(otp))
            throw new JobPortalExceeption("OTP_INCORRECT");

        User user = userRepository.findByEmail(email).orElseThrow(() -> new JobPortalExceeption("USER_NOT_FOUND"));
        user.setEmailVerified(true);
        userRepository.save(user);

        otpRepository.delete(otpEntity);

        return true;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(User::toDTO).toList();
    }

    @Override
    public List<UserDTO> getUsersByAccountType(AccountType accountType) {
        return userRepository.findByAccountType(accountType).stream().map(User::toDTO).toList();
    }

    @Override
    public void deleteUser(Long id) throws JobPortalExceeption {
        User user = userRepository.findById(id).orElseThrow(() -> new JobPortalExceeption("USER_NOT_FOUND"));
        userRepository.delete(user);
    }

    @Override
    public UserDTO createAdmin(UserDTO userDTO) throws JobPortalExceeption {
        Optional<User> optional = userRepository.findByEmail(userDTO.getEmail());
        if (optional.isPresent()) {
            throw new JobPortalExceeption("USER_FOUND");
        }
        userDTO.setId(Utilities.getNextSequence("users"));
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userDTO.setAccountType(AccountType.ADMIN);
        User user = userDTO.toEntity();
        user = userRepository.save(user);
        profileService.createProfile(userDTO.getEmail(), userDTO.getName(), user.getId());
        return user.toDTO();
    }

}

