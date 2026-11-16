package com.staywise.property.dto;

import com.staywise.amenity.Amenity;
import com.staywise.property.Property;
import com.staywise.property.PropertyImage;
import com.staywise.room.RoomType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class PropertyResponse {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String title;
    private String description;
    private String address;
    private String area;
    private String city;
    private String pincode;
    private String genderPreference;
    private String foodType;
    private String rules;
    private BigDecimal depositAmount;
    private BigDecimal minRent;
    private String verificationStatus;
    private String rejectionReason;
    private String contactPhone;
    private String contactEmail;
    private boolean isActive;
    private List<PropertyImage> images;
    private Set<Amenity> amenities;
    private List<RoomType> roomTypes;
    private Double averageRating;
    private long totalReviews;
    private LocalDateTime createdAt;

    public PropertyResponse() {}

    public static PropertyResponse fromEntity(Property p, Double avgRating, long totalReviews) {
        PropertyResponse res = new PropertyResponse();
        res.setId(p.getId());
        if (p.getOwner() != null) {
            res.setOwnerId(p.getOwner().getId());
            res.setOwnerName(p.getOwner().getFullName());
        }
        res.setTitle(p.getTitle());
        res.setDescription(p.getDescription());
        res.setAddress(p.getAddress());
        res.setArea(p.getArea());
        res.setCity(p.getCity());
        res.setPincode(p.getPincode());
        res.setGenderPreference(p.getGenderPreference());
        res.setFoodType(p.getFoodType());
        res.setRules(p.getRules());
        res.setDepositAmount(p.getDepositAmount());
        res.setMinRent(p.getMinRent());
        res.setVerificationStatus(p.getVerificationStatus());
        res.setRejectionReason(p.getRejectionReason());
        res.setContactPhone(p.getContactPhone());
        res.setContactEmail(p.getContactEmail());
        res.setActive(p.isActive());
        res.setImages(p.getImages() != null ? new ArrayList<>(p.getImages()) : new ArrayList<>());
        res.setAmenities(p.getAmenities() != null ? new HashSet<>(p.getAmenities()) : new HashSet<>());
        res.setRoomTypes(p.getRoomTypes() != null ? new ArrayList<>(p.getRoomTypes()) : new ArrayList<>());
        res.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 4.5);
        res.setTotalReviews(totalReviews);
        res.setCreatedAt(p.getCreatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getGenderPreference() { return genderPreference; }
    public void setGenderPreference(String genderPreference) { this.genderPreference = genderPreference; }

    public String getFoodType() { return foodType; }
    public void setFoodType(String foodType) { this.foodType = foodType; }

    public String getRules() { return rules; }
    public void setRules(String rules) { this.rules = rules; }

    public BigDecimal getDepositAmount() { return depositAmount; }
    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }

    public BigDecimal getMinRent() { return minRent; }
    public void setMinRent(BigDecimal minRent) { this.minRent = minRent; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public List<PropertyImage> getImages() { return images; }
    public void setImages(List<PropertyImage> images) { this.images = images; }

    public Set<Amenity> getAmenities() { return amenities; }
    public void setAmenities(Set<Amenity> amenities) { this.amenities = amenities; }

    public List<RoomType> getRoomTypes() { return roomTypes; }
    public void setRoomTypes(List<RoomType> roomTypes) { this.roomTypes = roomTypes; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
