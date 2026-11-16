package com.staywise.property;

import com.staywise.amenity.Amenity;
import com.staywise.amenity.AmenityRepository;
import com.staywise.common.exception.BadRequestException;
import com.staywise.common.exception.ResourceNotFoundException;
import com.staywise.property.dto.PropertyRequest;
import com.staywise.property.dto.PropertyResponse;
import com.staywise.review.ReviewRepository;
import com.staywise.user.User;
import com.staywise.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public PropertyService(
            PropertyRepository propertyRepository,
            AmenityRepository amenityRepository,
            UserRepository userRepository,
            ReviewRepository reviewRepository
    ) {
        this.propertyRepository = propertyRepository;
        this.amenityRepository = amenityRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public Page<PropertyResponse> searchProperties(
            String location,
            String gender,
            BigDecimal maxRent,
            Boolean verifiedOnly,
            Pageable pageable
    ) {
        String status = (verifiedOnly != null && verifiedOnly) ? "APPROVED" : null;
        Page<Property> page = propertyRepository.searchProperties(status, location, gender, maxRent, pageable);

        return page.map(p -> {
            Double avgRating = reviewRepository.getAverageRatingForProperty(p.getId());
            long totalReviews = reviewRepository.countByPropertyId(p.getId());
            return PropertyResponse.fromEntity(p, avgRating, totalReviews);
        });
    }

    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id) {
        Property p = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        Double avgRating = reviewRepository.getAverageRatingForProperty(p.getId());
        long totalReviews = reviewRepository.countByPropertyId(p.getId());
        return PropertyResponse.fromEntity(p, avgRating, totalReviews);
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getOwnerProperties(Long ownerId) {
        List<Property> properties = propertyRepository.findByOwnerId(ownerId);
        return properties.stream().map(p -> {
            Double avgRating = reviewRepository.getAverageRatingForProperty(p.getId());
            long totalReviews = reviewRepository.countByPropertyId(p.getId());
            return PropertyResponse.fromEntity(p, avgRating, totalReviews);
        }).collect(Collectors.toList());
    }

    @Transactional
    public PropertyResponse createProperty(Long ownerId, PropertyRequest req) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Property p = new Property();
        p.setOwner(owner);
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setAddress(req.getAddress());
        p.setArea(req.getArea());
        p.setCity(req.getCity() != null ? req.getCity() : "Bengaluru");
        p.setPincode(req.getPincode());
        p.setGenderPreference(req.getGenderPreference());
        p.setFoodType(req.getFoodType());
        p.setRules(req.getRules());
        p.setDepositAmount(req.getDepositAmount());
        p.setMinRent(req.getMinRent());
        p.setContactPhone(req.getContactPhone());
        p.setContactEmail(req.getContactEmail());
        p.setVerificationStatus("PENDING"); // automatically submit for verification

        if (req.getAmenityIds() != null && !req.getAmenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepository.findAllById(req.getAmenityIds());
            p.setAmenities(new HashSet<>(amenities));
        }

        if (req.getImageUrls() != null && !req.getImageUrls().isEmpty()) {
            int order = 1;
            for (String url : req.getImageUrls()) {
                PropertyImage img = new PropertyImage(p, url, "Property photo", order == 1, order++);
                p.getImages().add(img);
            }
        }

        Property saved = propertyRepository.save(p);
        return PropertyResponse.fromEntity(saved, 5.0, 0);
    }

    @Transactional
    public PropertyResponse updateProperty(Long propertyId, Long ownerId, PropertyRequest req) {
        Property p = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (!p.getOwner().getId().equals(ownerId)) {
            throw new BadRequestException("You can only update properties that belong to you");
        }

        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setAddress(req.getAddress());
        p.setArea(req.getArea());
        p.setPincode(req.getPincode());
        p.setGenderPreference(req.getGenderPreference());
        p.setFoodType(req.getFoodType());
        p.setRules(req.getRules());
        p.setDepositAmount(req.getDepositAmount());
        p.setMinRent(req.getMinRent());
        p.setContactPhone(req.getContactPhone());
        p.setContactEmail(req.getContactEmail());

        if (req.getAmenityIds() != null) {
            List<Amenity> amenities = amenityRepository.findAllById(req.getAmenityIds());
            p.setAmenities(new HashSet<>(amenities));
        }

        Property saved = propertyRepository.save(p);
        Double avgRating = reviewRepository.getAverageRatingForProperty(saved.getId());
        long totalReviews = reviewRepository.countByPropertyId(saved.getId());
        return PropertyResponse.fromEntity(saved, avgRating, totalReviews);
    }
}
