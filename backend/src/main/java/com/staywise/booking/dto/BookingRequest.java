package com.staywise.booking.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Room Type ID is required")
    private Long roomTypeId;

    @NotNull(message = "Move in date is required")
    private LocalDate moveInDate;

    private int bedsCount = 1;
    private String userNotes;

    public BookingRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public Long getRoomTypeId() { return roomTypeId; }
    public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }

    public LocalDate getMoveInDate() { return moveInDate; }
    public void setMoveInDate(LocalDate moveInDate) { this.moveInDate = moveInDate; }

    public int getBedsCount() { return bedsCount; }
    public void setBedsCount(int bedsCount) { this.bedsCount = bedsCount; }

    public String getUserNotes() { return userNotes; }
    public void setUserNotes(String userNotes) { this.userNotes = userNotes; }
}
