package com.staywise.review;

import com.staywise.common.exception.BadRequestException;
import com.staywise.common.exception.ResourceNotFoundException;
import com.staywise.common.response.ApiResponse;
import com.staywise.property.Property;
import com.staywise.property.PropertyRepository;
import com.staywise.user.User;
import com.staywise.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/properties/{propertyId}/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public ReviewController(
            ReviewRepository reviewRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Review>>> getReviews(@PathVariable Long propertyId) {
        return ResponseEntity.ok(ApiResponse.success(reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Review>> addReview(
            @PathVariable Long propertyId,
            @RequestBody Map<String, Object> body
    ) {
        User user = getAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        int rating = body.get("rating") != null ? Integer.parseInt(body.get("rating").toString()) : 5;
        String comment = body.get("comment") != null ? body.get("comment").toString() : "";

        if (rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }
        if (comment.isBlank()) {
            throw new BadRequestException("Review comment cannot be empty");
        }

        Review review = new Review(user, property, rating, comment);
        return ResponseEntity.ok(ApiResponse.success("Review posted successfully", reviewRepository.save(review)));
    }
}
