package com.staywise.wishlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<WishlistItem> findByUserIdAndPropertyId(Long userId, Long propertyId);
    boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);
    void deleteByUserIdAndPropertyId(Long userId, Long propertyId);
}
