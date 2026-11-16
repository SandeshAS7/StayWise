package com.staywise.booking;

import com.staywise.booking.dto.BookingRequest;
import com.staywise.common.exception.BadRequestException;
import com.staywise.common.response.ApiResponse;
import com.staywise.user.User;
import com.staywise.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest req) {
        User user = getAuthenticatedUser();
        Booking booking = bookingService.createBooking(user.getId(), req);
        return ResponseEntity.ok(ApiResponse.success("Booking request submitted successfully", booking));
    }

    @GetMapping("/bookings/my")
    public ResponseEntity<ApiResponse<List<Booking>>> getMyBookings() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(bookingService.getUserBookings(user.getId())));
    }

    @GetMapping("/owner/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getOwnerBookings() {
        User owner = getAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(bookingService.getOwnerBookings(owner.getId())));
    }

    @PatchMapping("/owner/bookings/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        User owner = getAuthenticatedUser();
        String status = body.get("status");
        String notes = body.get("notes");
        if (status == null || status.isBlank()) {
            throw new BadRequestException("Status is required");
        }
        Booking booking = bookingService.updateBookingStatus(id, owner.getId(), status, notes);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated to " + status, booking));
    }

    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Booking booking = bookingService.cancelBooking(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }
}
