package com.staywise.booking;

import com.staywise.booking.dto.BookingRequest;
import com.staywise.common.exception.BadRequestException;
import com.staywise.common.exception.ResourceNotFoundException;
import com.staywise.property.Property;
import com.staywise.property.PropertyRepository;
import com.staywise.room.RoomType;
import com.staywise.room.RoomTypeRepository;
import com.staywise.user.User;
import com.staywise.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            PropertyRepository propertyRepository,
            RoomTypeRepository roomTypeRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking createBooking(Long userId, BookingRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Property property = propertyRepository.findById(req.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        RoomType roomType = roomTypeRepository.findById(req.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found"));

        if (!roomType.getProperty().getId().equals(property.getId())) {
            throw new BadRequestException("Room type does not belong to the selected property");
        }

        if (roomType.getAvailableBeds() < req.getBedsCount()) {
            throw new BadRequestException("Not enough beds available in this room type");
        }

        BigDecimal totalRent = roomType.getRentPerMonth().multiply(BigDecimal.valueOf(req.getBedsCount()));
        BigDecimal totalDeposit = roomType.getDeposit().multiply(BigDecimal.valueOf(req.getBedsCount()));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setProperty(property);
        booking.setRoomType(roomType);
        booking.setMoveInDate(req.getMoveInDate());
        booking.setBedsCount(req.getBedsCount());
        booking.setTotalRent(totalRent);
        booking.setDepositAmount(totalDeposit);
        booking.setStatus("PENDING");
        booking.setUserNotes(req.getUserNotes());

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getOwnerBookings(Long ownerId) {
        return bookingRepository.findByOwnerId(ownerId);
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, Long ownerId, String newStatus, String ownerNotes) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getProperty().getOwner().getId().equals(ownerId)) {
            throw new BadRequestException("You can only manage bookings for your own properties");
        }

        String currentStatus = booking.getStatus();

        if ("CONFIRMED".equalsIgnoreCase(newStatus) && !"CONFIRMED".equalsIgnoreCase(currentStatus)) {
            RoomType roomType = booking.getRoomType();
            if (roomType.getAvailableBeds() < booking.getBedsCount()) {
                throw new BadRequestException("Cannot confirm booking: Insufficient beds available");
            }
            roomType.setAvailableBeds(roomType.getAvailableBeds() - booking.getBedsCount());
            roomTypeRepository.save(roomType);
        } else if (("REJECTED".equalsIgnoreCase(newStatus) || "CANCELLED".equalsIgnoreCase(newStatus))
                && "CONFIRMED".equalsIgnoreCase(currentStatus)) {
            // Restore bed availability
            RoomType roomType = booking.getRoomType();
            roomType.setAvailableBeds(roomType.getAvailableBeds() + booking.getBedsCount());
            roomTypeRepository.save(roomType);
        }

        booking.setStatus(newStatus.toUpperCase());
        if (ownerNotes != null) {
            booking.setOwnerNotes(ownerNotes);
        }

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            return booking;
        }

        if ("CONFIRMED".equals(booking.getStatus())) {
            RoomType roomType = booking.getRoomType();
            roomType.setAvailableBeds(roomType.getAvailableBeds() + booking.getBedsCount());
            roomTypeRepository.save(roomType);
        }

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }
}
