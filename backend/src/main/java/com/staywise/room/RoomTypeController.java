package com.staywise.room;

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

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RoomTypeController {

    private final RoomTypeRepository roomTypeRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public RoomTypeController(
            RoomTypeRepository roomTypeRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository
    ) {
        this.roomTypeRepository = roomTypeRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    @GetMapping("/properties/{propertyId}/rooms")
    public ResponseEntity<ApiResponse<List<RoomType>>> getRoomsByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(ApiResponse.success(roomTypeRepository.findByPropertyId(propertyId)));
    }

    public static class RoomTypeDto {
        public String name;
        public int sharingCount;
        public int totalBeds;
        public int availableBeds;
        public BigDecimal rentPerMonth;
        public BigDecimal deposit;
        public String roomFeatures;
    }

    @PostMapping("/owner/properties/{propertyId}/rooms")
    public ResponseEntity<ApiResponse<RoomType>> addRoomType(
            @PathVariable Long propertyId,
            @RequestBody RoomTypeDto dto
    ) {
        User owner = getAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (!property.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("You can only add rooms to your own properties");
        }

        RoomType room = new RoomType(
                property,
                dto.name,
                dto.sharingCount,
                dto.totalBeds,
                dto.availableBeds,
                dto.rentPerMonth,
                dto.deposit,
                dto.roomFeatures
        );

        return ResponseEntity.ok(ApiResponse.success("Room type added successfully", roomTypeRepository.save(room)));
    }
}
