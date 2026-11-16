package com.staywise.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    List<Property> findByOwnerId(Long ownerId);

    long countByVerificationStatus(String status);

    @Query("SELECT p FROM Property p WHERE p.isActive = true AND (:status IS NULL OR p.verificationStatus = :status) " +
           "AND (:location IS NULL OR LOWER(p.area) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(p.city) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(p.title) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:gender IS NULL OR p.genderPreference = :gender OR p.genderPreference = 'UNISEX') " +
           "AND (:maxRent IS NULL OR p.minRent <= :maxRent)")
    Page<Property> searchProperties(
            @Param("status") String status,
            @Param("location") String location,
            @Param("gender") String gender,
            @Param("maxRent") BigDecimal maxRent,
            Pageable pageable
    );
}
