package com.jobportal.api;

import com.jobportal.dto.LoginDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.entity.User;
import com.jobportal.exception.JobPortalExceeption;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtService;
import com.jobportal.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@Validated
@RequestMapping("/users")
public class UserAPI {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<UserDTO>registerUser(@RequestBody @Valid UserDTO userDTO) throws JobPortalExceeption {
        userDTO = userService.registerUser(userDTO);

        return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO>loginUser(@RequestBody @Valid LoginDTO loginDTO) throws JobPortalExceeption {

        return new ResponseEntity<>(userService.loginUser(loginDTO), HttpStatus.OK);
    }

    @PostMapping("/change-pass")
    public ResponseEntity<ResponseDTO> changePassword(@RequestBody @Valid LoginDTO loginDTO) throws JobPortalExceeption {

        return new ResponseEntity<>(userService.changePassword(loginDTO), HttpStatus.OK);
    }

    @PostMapping("/send-otp/{email}")
    public ResponseEntity<ResponseDTO>sendOtp(@PathVariable @Email(message = "{user.email.invalid}") String email) throws Exception {

        userService.sendOtp(email);

        return new ResponseEntity<>(new ResponseDTO("OTP Sent Successfully."), HttpStatus.OK);
    }

    @GetMapping("/verify-otp/{email}/{otp}")
    public ResponseEntity<ResponseDTO> verifyOtp(@PathVariable @Email(message = "{user.email.invalid}") String email, @PathVariable @Pattern(regexp = "^[0-9]{6}$", message = "{otp.invalid}") String otp) throws JobPortalExceeption {

        userService.verifyOtp(email, otp);

        return new ResponseEntity<>(new ResponseDTO("OTP Verified Successfully."), HttpStatus.OK);
    }

    @PostMapping("/verify-email/{email}/{otp}")
    public ResponseEntity<ResponseDTO> verifyEmail(@PathVariable @Email(message = "{user.email.invalid}") String email,
            @PathVariable @Pattern(regexp = "^[0-9]{6}$", message = "{otp.invalid}") String otp)
            throws JobPortalExceeption {

        userService.verifyEmail(email, otp);

        return new ResponseEntity<>(new ResponseDTO("Email Verified Successfully."), HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return new ResponseEntity<>(new ResponseDTO("Refresh token is required."), HttpStatus.BAD_REQUEST);
        }

        try {
            String email = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new JobPortalExceeption("USER_NOT_FOUND"));

            if (!jwtService.isTokenValid(refreshToken, user)) {
                return new ResponseEntity<>(new ResponseDTO("Invalid or expired refresh token."),
                        HttpStatus.UNAUTHORIZED);
            }

            String newAccessToken = jwtService.generateToken(user);

            return new ResponseEntity<>(Map.of(
                    "token", newAccessToken,
                    "refreshToken", refreshToken), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseDTO("Invalid or expired refresh token."), HttpStatus.UNAUTHORIZED);
        }
    }
}
