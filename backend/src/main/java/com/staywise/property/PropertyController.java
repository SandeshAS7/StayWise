package com.staywise.property;

import com.staywise.common.exception.BadRequestException;
import com.staywise.common.response.ApiResponse;
import com.staywise.property.dto.PropertyRequest;
import com.staywise.property.dto.PropertyResponse;
import com.staywise.user.User;
import com.staywise.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PropertyController {

    private final PropertyService propertyService;
    private final UserRepository userRepository;

    public PropertyController(PropertyService propertyService, UserRepository userRepository) {
        this.propertyService = propertyService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BadRequestException("Not authenticated");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> searchProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false, defaultValue = "false") Boolean verifiedOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort
    ) {
        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        String sortProperty = sort[0].equals("price") ? "minRent" : sort[0];
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortProperty));

        Page<PropertyResponse> result = propertyService.searchProperties(location, gender, maxRent, verifiedOnly, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/properties/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getPropertyById(id)));
    }

    @GetMapping("/owner/properties")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getOwnerProperties() {
        User owner = getAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(propertyService.getOwnerProperties(owner.getId())));
    }

    @PostMapping("/owner/properties")
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(@Valid @RequestBody PropertyRequest req) {
        User owner = getAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Property created and submitted for verification", propertyService.createProperty(owner.getId(), req)));
    }

    @PutMapping("/owner/properties/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest req
    ) {
        User owner = getAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Property updated successfully", propertyService.updateProperty(id, owner.getId(), req)));
    }
}
