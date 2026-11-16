package com.staywise.property.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class PropertyRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Area is required")
    private String area;

    private String city = "Bengaluru";

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private String genderPreference = "UNISEX";
    private String foodType = "BOTH";
    private String rules;

    @NotNull(message = "Deposit amount is required")
    private BigDecimal depositAmount;

    @NotNull(message = "Minimum rent is required")
    private BigDecimal minRent;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    @NotBlank(message = "Contact email is required")
    private String contactEmail;

    private List<Long> amenityIds;
    private List<String> imageUrls;

    public PropertyRequest() {}

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

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public List<Long> getAmenityIds() { return amenityIds; }
    public void setAmenityIds(List<Long> amenityIds) { this.amenityIds = amenityIds; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
