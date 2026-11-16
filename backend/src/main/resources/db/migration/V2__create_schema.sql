-- V2__create_schema.sql: Core StayWise database schema

-- 1. Extend app_users table
ALTER TABLE app_users ADD COLUMN phone_number VARCHAR(20) NULL AFTER full_name;

-- 2. Owner profiles
CREATE TABLE owner_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    business_name VARCHAR(150) NOT NULL,
    govt_id_type VARCHAR(50) NULL,
    govt_id_number VARCHAR(100) NULL,
    address VARCHAR(255) NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_owner_profiles PRIMARY KEY (id),
    CONSTRAINT uk_owner_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_owner_profiles_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

-- 3. PG Properties
CREATE TABLE pg_properties (
    id BIGINT NOT NULL AUTO_INCREMENT,
    owner_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    area VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Bengaluru',
    pincode VARCHAR(20) NOT NULL,
    gender_preference ENUM('MALE', 'FEMALE', 'UNISEX') NOT NULL DEFAULT 'UNISEX',
    food_type ENUM('VEG', 'NON_VEG', 'BOTH', 'NONE') NOT NULL DEFAULT 'BOTH',
    rules TEXT NULL,
    deposit_amount DECIMAL(10, 2) NOT NULL DEFAULT 5000.00,
    min_rent DECIMAL(10, 2) NOT NULL DEFAULT 6000.00,
    verification_status ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    rejection_reason VARCHAR(255) NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(254) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_pg_properties PRIMARY KEY (id),
    CONSTRAINT fk_pg_properties_owner FOREIGN KEY (owner_id) REFERENCES app_users(id) ON DELETE RESTRICT
);

-- Index for searching properties
CREATE INDEX idx_pg_properties_area ON pg_properties(area);
CREATE INDEX idx_pg_properties_gender ON pg_properties(gender_preference);
CREATE INDEX idx_pg_properties_status ON pg_properties(verification_status);
CREATE INDEX idx_pg_properties_min_rent ON pg_properties(min_rent);

-- 4. Property Images
CREATE TABLE pg_images (
    id BIGINT NOT NULL AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(100) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_pg_images PRIMARY KEY (id),
    CONSTRAINT fk_pg_images_property FOREIGN KEY (property_id) REFERENCES pg_properties(id) ON DELETE CASCADE
);

-- 5. Amenities Master Table
CREATE TABLE amenities (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,

    CONSTRAINT pk_amenities PRIMARY KEY (id),
    CONSTRAINT uk_amenities_name UNIQUE (name)
);

-- 6. Property Amenities Mapping Table
CREATE TABLE pg_amenities (
    property_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,

    CONSTRAINT pk_pg_amenities PRIMARY KEY (property_id, amenity_id),
    CONSTRAINT fk_pg_amenities_property FOREIGN KEY (property_id) REFERENCES pg_properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_pg_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- 7. Room Types and Availability
CREATE TABLE room_types (
    id BIGINT NOT NULL AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    name VARCHAR(80) NOT NULL,
    sharing_count INT NOT NULL DEFAULT 1,
    total_beds INT NOT NULL DEFAULT 1,
    available_beds INT NOT NULL DEFAULT 1,
    rent_per_month DECIMAL(10, 2) NOT NULL,
    deposit DECIMAL(10, 2) NOT NULL,
    room_features VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_room_types PRIMARY KEY (id),
    CONSTRAINT fk_room_types_property FOREIGN KEY (property_id) REFERENCES pg_properties(id) ON DELETE CASCADE
);

CREATE INDEX idx_room_types_property ON room_types(property_id);

-- 8. Bookings Table
CREATE TABLE bookings (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    room_type_id BIGINT NOT NULL,
    move_in_date DATE NOT NULL,
    beds_count INT NOT NULL DEFAULT 1,
    total_rent DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    owner_notes TEXT NULL,
    user_notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_bookings PRIMARY KEY (id),
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_property FOREIGN KEY (property_id) REFERENCES pg_properties(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_room_type FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE RESTRICT
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- 9. Reviews Table
CREATE TABLE reviews (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_reviews PRIMARY KEY (id),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_reviews_property FOREIGN KEY (property_id) REFERENCES pg_properties(id) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_property ON reviews(property_id);

-- 10. Wishlist Items
CREATE TABLE wishlist_items (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_wishlist_items PRIMARY KEY (id),
    CONSTRAINT uk_wishlist_user_property UNIQUE (user_id, property_id),
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_property FOREIGN KEY (property_id) REFERENCES pg_properties(id) ON DELETE CASCADE
);
