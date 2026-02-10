package com.donation.dto;

import com.donation.enums.Role;
import lombok.Data;

import java.util.List;

public class Dtos {
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String password;
        private Role role;
    }

    @Data
    public static class RequestItemDto {
        private String itemName;
        private int requiredQuantity;
    }

    @Data
    public static class CreateRequestDto {
        private Long userId; // For simplicity in this non-secured version, normally extracted from token
        private String title;
        private String location;
        private List<RequestItemDto> items;
    }

    @Data
    public static class FulfillRequestDto {
        private Long donorId;
        private Long requestItemId;
        private int quantity;
    }
}
