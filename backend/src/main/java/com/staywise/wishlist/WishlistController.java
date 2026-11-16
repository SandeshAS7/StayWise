package com.staywise.wishlist;

import com.staywise.common.exception.BadRequestException;
import com.staywise.common.exception.ResourceNotFoundException;
import com.staywise.common.response.ApiResponse;
import com.staywise.property.Property;
import com.staywise.property.PropertyRepository;
import com.staywise.property.PropertyService;
import com.staywise.property.dto.PropertyResponse;
import com.staywise.user.User;
import com.staywise.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyService propertyService;
    private final UserRepository userRepository;

    public WishlistController(
            WishlistRepository wishlistRepository,
            PropertyRepository propertyRepository,
            PropertyService propertyService,
            UserRepository userRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.propertyRepository = propertyRepository;
        this.propertyService = propertyService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getWishlist() {
        User user = getAuthenticatedUser();
        List<WishlistItem> items = wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<PropertyResponse> properties = items.stream()
                .map(item -> propertyService.getPropertyById(item.getProperty().getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(properties));
    }

    @PostMapping("/{propertyId}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> addToWishlist(@PathVariable Long propertyId) {
        User user = getAuthenticatedUser();
        if (wishlistRepository.existsByUserIdAndPropertyId(user.getId(), propertyId)) {
            return ResponseEntity.ok(ApiResponse.success("Property is already in your wishlist", "ALREADY_EXISTS"));
        }

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        wishlistRepository.save(new WishlistItem(user, property));
        return ResponseEntity.ok(ApiResponse.success("Property added to wishlist", "ADDED"));
    }

    @DeleteMapping("/{propertyId}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> removeFromWishlist(@PathVariable Long propertyId) {
        User user = getAuthenticatedUser();
        wishlistRepository.deleteByUserIdAndPropertyId(user.getId(), propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property removed from wishlist", "REMOVED"));
    }
}
