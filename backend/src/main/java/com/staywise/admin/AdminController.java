package com.staywise.admin;

import com.staywise.booking.BookingRepository;
import com.staywise.common.exception.ResourceNotFoundException;
import com.staywise.common.response.ApiResponse;
import com.staywise.property.Property;
import com.staywise.property.PropertyRepository;
import com.staywise.property.PropertyService;
import com.staywise.property.dto.PropertyResponse;
import com.staywise.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final PropertyService propertyService;

    public AdminController(
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            BookingRepository bookingRepository,
            PropertyService propertyService
    ) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.bookingRepository = bookingRepository;
        this.propertyService = propertyService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlatformStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalStudents", userRepository.countByRole("ROLE_STUDENT"));
        stats.put("totalOwners", userRepository.countByRole("ROLE_OWNER"));
        stats.put("totalProperties", propertyRepository.count());
        stats.put("verifiedProperties", propertyRepository.countByVerificationStatus("APPROVED"));
        stats.put("pendingVerifications", propertyRepository.countByVerificationStatus("PENDING"));
        stats.put("totalBookings", bookingRepository.count());
        stats.put("confirmedBookings", bookingRepository.countByStatus("CONFIRMED"));
        stats.put("pendingBookings", bookingRepository.countByStatus("PENDING"));

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/verifications")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getPendingVerifications() {
        List<Property> properties = propertyRepository.findAll().stream()
                .filter(p -> "PENDING".equalsIgnoreCase(p.getVerificationStatus()))
                .collect(Collectors.toList());

        List<PropertyResponse> responses = properties.stream()
                .map(p -> propertyService.getPropertyById(p.getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PatchMapping("/verifications/{id}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<PropertyResponse>> approveVerification(@PathVariable Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        property.setVerificationStatus("APPROVED");
        property.setRejectionReason(null);
        propertyRepository.save(property);

        return ResponseEntity.ok(ApiResponse.success("Property verified and approved successfully", propertyService.getPropertyById(id)));
    }

    @PatchMapping("/verifications/{id}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<PropertyResponse>> rejectVerification(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        String reason = body.getOrDefault("reason", "Property details did not meet StayWise verification standards");
        property.setVerificationStatus("REJECTED");
        property.setRejectionReason(reason);
        propertyRepository.save(property);

        return ResponseEntity.ok(ApiResponse.success("Property verification rejected", propertyService.getPropertyById(id)));
    }
}
