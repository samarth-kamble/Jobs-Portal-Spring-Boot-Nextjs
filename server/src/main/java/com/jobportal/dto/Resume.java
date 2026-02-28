package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Resume {
    private String name;
    private String document; // Base64 encoded
    private LocalDateTime uploadedAt;
}
