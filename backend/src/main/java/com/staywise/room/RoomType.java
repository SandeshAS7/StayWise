package com.staywise.room;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.staywise.property.Property;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_types")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    @JsonIgnore
    private Property property;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(name = "sharing_count", nullable = false)
    private int sharingCount = 1;

    @Column(name = "total_beds", nullable = false)
    private int totalBeds = 1;

    @Column(name = "available_beds", nullable = false)
    private int availableBeds = 1;

    @Column(name = "rent_per_month", nullable = false, precision = 10, scale = 2)
    private BigDecimal rentPerMonth;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal deposit;

    @Column(name = "room_features", length = 255)
    private String roomFeatures;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public RoomType() {}

    public RoomType(Property property, String name, int sharingCount, int totalBeds, int availableBeds, BigDecimal rentPerMonth, BigDecimal deposit, String roomFeatures) {
        this.property = property;
        this.name = name;
        this.sharingCount = sharingCount;
        this.totalBeds = totalBeds;
        this.availableBeds = availableBeds;
        this.rentPerMonth = rentPerMonth;
        this.deposit = deposit;
        this.roomFeatures = roomFeatures;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSharingCount() {
        return sharingCount;
    }

    public void setSharingCount(int sharingCount) {
        this.sharingCount = sharingCount;
    }

    public int getTotalBeds() {
        return totalBeds;
    }

    public void setTotalBeds(int totalBeds) {
        this.totalBeds = totalBeds;
    }

    public int getAvailableBeds() {
        return availableBeds;
    }

    public void setAvailableBeds(int availableBeds) {
        this.availableBeds = availableBeds;
    }

    public BigDecimal getRentPerMonth() {
        return rentPerMonth;
    }

    public void setRentPerMonth(BigDecimal rentPerMonth) {
        this.rentPerMonth = rentPerMonth;
    }

    public BigDecimal getDeposit() {
        return deposit;
    }

    public void setDeposit(BigDecimal deposit) {
        this.deposit = deposit;
    }

    public String getRoomFeatures() {
        return roomFeatures;
    }

    public void setRoomFeatures(String roomFeatures) {
        this.roomFeatures = roomFeatures;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
