-- V3__seed_data.sql: Realistic seed data for StayWise in Bengaluru

-- 1. Users
-- password for all: password123 ($2a$10$NjfuVjncj28krSRYDq.YK.QFEYg/.vH19RiGPHPUJws8..qxcm8sy)
INSERT INTO app_users (id, email, password_hash, full_name, phone_number, role) VALUES
(1, 'admin@staywise.com', '$2a$10$NjfuVjncj28krSRYDq.YK.QFEYg/.vH19RiGPHPUJws8..qxcm8sy', 'StayWise Admin', '+91 9876543210', 'ROLE_ADMIN'),
(2, 'owner.suresh@staywise.com', '$2a$10$NjfuVjncj28krSRYDq.YK.QFEYg/.vH19RiGPHPUJws8..qxcm8sy', 'Suresh Reddy', '+91 9845012345', 'ROLE_OWNER'),
(3, 'owner.ramesh@staywise.com', '$2a$10$NjfuVjncj28krSRYDq.YK.QFEYg/.vH19RiGPHPUJws8..qxcm8sy', 'Ramesh Rao', '+91 9845067890', 'ROLE_OWNER'),
(4, 'student.sandesh@staywise.com', '$2a$10$NjfuVjncj28krSRYDq.YK.QFEYg/.vH19RiGPHPUJws8..qxcm8sy', 'Sandesh Kumar', '+91 9741234567', 'ROLE_STUDENT'),
(5, 'student.priya@staywise.com', '$2a$10$NjfuVjncj28krSRYDq.YK.QFEYg/.vH19RiGPHPUJws8..qxcm8sy', 'Priya Sharma', '+91 9612345678', 'ROLE_STUDENT');

-- 2. Owner Profiles
INSERT INTO owner_profiles (id, user_id, business_name, govt_id_type, govt_id_number, address, is_verified) VALUES
(1, 2, 'Reddy Accommodations & Stays', 'AADHAAR', 'XXXX-XXXX-4589', '7th Cross, BTM 2nd Stage, Bengaluru', TRUE),
(2, 3, 'Comfort Zone PG Network', 'PAN', 'ABCDE1234F', '80 Feet Road, Koramangala 4th Block, Bengaluru', TRUE);

-- 3. Amenities
INSERT INTO amenities (id, name, icon, description) VALUES
(1, 'High-Speed Wi-Fi', 'Wifi', 'High-speed fiber internet in all rooms and common areas'),
(2, '3 Times Food', 'Utensils', 'Hygienic home-cooked South & North Indian breakfast, lunch & dinner'),
(3, 'Air Conditioning', 'AirVent', 'Climate controlled split AC in rooms'),
(4, 'Washing Machine', 'Shirt', 'Automatic washing machines and dedicated drying area'),
(5, 'Power Backup', 'Zap', '24/7 UPS and generator power backup for uninterrupted work/study'),
(6, 'Attached Bathroom', 'Bath', 'Private attached modern western washroom with hot water geyser'),
(7, 'CCTV Security', 'ShieldCheck', '24/7 CCTV surveillance and biometric door access'),
(8, 'Daily Housekeeping', 'Sparkles', 'Daily room sweeping, mopping and trash collection'),
(9, 'Refrigerator', 'Refrigerator', 'Common refrigerator and microwave on every floor'),
(10, 'RO Drinking Water', 'Droplets', 'Clean and purified RO drinking water dispensers');

-- 4. Properties in Bengaluru
INSERT INTO pg_properties (id, owner_id, title, description, address, area, city, pincode, gender_preference, food_type, rules, deposit_amount, min_rent, verification_status, contact_phone, contact_email, is_active) VALUES
(1, 2, 'Zolo Stays Premium Luxury PG', 'Modern coliving space in the heart of BTM Layout. Walking distance from Udupi Garden bus stop and Vega City Mall. Ideal for software engineers and college students. High-speed 100Mbps Wi-Fi, daily housekeeping, 3 times delicious food, and spacious study desks.', '14th Main, 7th Cross, BTM 2nd Stage', 'BTM Layout', 'Bengaluru', '560076', 'UNISEX', 'BOTH', 'No smoking inside rooms. Gate closes at 11:30 PM. Visitors allowed in common lounge.', 5000.00, 7500.00, 'APPROVED', '+91 9845012345', 'suresh.pg@staywise.com', TRUE),

(2, 2, 'Sri Balaji Luxury Gents PG', 'Well-maintained and quiet boys accommodation near Koramangala 5th Block food street and Sony World Signal. Close to major IT companies (Infosys, Flipkart, Bosch) and St. John Medical College. Features AC rooms, high-speed Wi-Fi, and 24/7 hot water.', '23, 1st Cross, Koramangala 5th Block', 'Koramangala', 'Bengaluru', '560095', 'MALE', 'BOTH', 'Quiet hours after 10 PM. Alcohol strictly prohibited.', 6000.00, 8500.00, 'APPROVED', '+91 9845012345', 'balaji.pg@staywise.com', TRUE),

(3, 3, 'Green Oasis Ladies PG & Coliving', 'Safe and secure luxury hostel for women and working professionals in HSR Sector 3. Biometric entry, 24/7 female warden, CCTV security, gym access, home-cooked hygienic meals with weekly specials. 5 minutes from Agara Lake.', '452, 19th Main Road, Sector 3, HSR Layout', 'HSR Layout', 'Bengaluru', '560102', 'FEMALE', 'BOTH', 'Biometric entry only. Strict female-only access inside living quarters.', 6000.00, 8000.00, 'APPROVED', '+91 9845067890', 'greenoasis@staywise.com', TRUE),

(4, 3, 'Urban Nest Premium Stays', 'Vibrant co-living hostel in Indiranagar 100 Feet Road area. Metro station is just a 5-minute walk away. Fully furnished private and sharing rooms, gaming zone, terrace garden, and high-speed Wi-Fi.', '88, 12th Main Road, HAL 2nd Stage, Indiranagar', 'Indiranagar', 'Bengaluru', '560038', 'UNISEX', 'VEG', 'Smoking and alcohol strictly restricted to designated terrace zone.', 10000.00, 11000.00, 'APPROVED', '+91 9845067890', 'urbannest@staywise.com', TRUE),

(5, 2, 'Sai Comforts PG & Residency', 'Affordable and clean PG near Marathahalli Bridge and Outer Ring Road tech parks. Direct connectivity to Embassy Tech Village, Prestige Tech Park, and Ecospace. Includes daily cleaning, Wi-Fi, and power backup.', '72, Outer Ring Road, Near Kalamandir, Marathahalli', 'Marathahalli', 'Bengaluru', '560037', 'UNISEX', 'BOTH', 'Visitors allowed till 8 PM.', 4000.00, 5500.00, 'PENDING', '+91 9845012345', 'saicomforts@staywise.com', TRUE),

(6, 3, 'TechCity Executive PG for Men', 'Executive accommodation situated right next to Infosys Gate 1 in Electronic City Phase 1. Designed for IT professionals looking for high-speed fiber internet, peaceful work environment, AC rooms, and self-cooking kitchen option.', '105, Neeladri Road, Electronic City Phase 1', 'Electronic City', 'Bengaluru', '560100', 'MALE', 'BOTH', 'No loud music. Visitors permitted in lobby.', 5000.00, 7000.00, 'APPROVED', '+91 9845067890', 'techcity.pg@staywise.com', TRUE);

-- 5. Property Images (Clean high quality Unsplash interior/bedroom photos)
INSERT INTO pg_images (property_id, image_url, caption, is_primary, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', 'Modern Double Sharing Room', TRUE, 1),
(1, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', 'Clean Study Area & Wardrobes', FALSE, 2),
(1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'Attached Washroom', FALSE, 3),

(2, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', 'Spacious Single Bed Room', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', 'Dining Hall & Meal Area', FALSE, 2),

(3, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'Cozy Girls Room with Balcony', TRUE, 1),
(3, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', 'Modern Interior Decor', FALSE, 2),

(4, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', 'Premium Studio Coliving Room', TRUE, 1),
(4, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', 'Lounge & Working Space', FALSE, 2),

(5, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', 'Twin Sharing Bed Setup', TRUE, 1),

(6, 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=800&q=80', 'Executive Deluxe Room', TRUE, 1);

-- 6. Property Amenities Mapping
INSERT INTO pg_amenities (property_id, amenity_id) VALUES
(1, 1), (1, 2), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 10),
(2, 1), (2, 2), (2, 3), (2, 5), (2, 6), (2, 7), (2, 8), (2, 10),
(3, 1), (3, 2), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10),
(4, 1), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (4, 9), (4, 10),
(5, 1), (5, 2), (5, 4), (5, 6), (5, 8), (5, 10),
(6, 1), (6, 2), (6, 3), (6, 5), (6, 6), (6, 7), (6, 8), (6, 10);

-- 7. Room Types and Live Availability
INSERT INTO room_types (id, property_id, name, sharing_count, total_beds, available_beds, rent_per_month, deposit, room_features) VALUES
(1, 1, 'Single Sharing (Private Room)', 1, 6, 2, 14000.00, 8000.00, 'Private Room, Study Desk, Balcony, Attached Washroom, AC'),
(2, 1, 'Double Sharing', 2, 20, 5, 8500.00, 5000.00, 'Spacious room, 2 Wardrobes, Attached Washroom, Geyser'),
(3, 1, 'Triple Sharing', 3, 30, 8, 7500.00, 5000.00, '3 Beds, Lockers, Attached Washroom, Power Backup'),

(4, 2, 'Single Sharing AC', 1, 4, 1, 15000.00, 10000.00, 'Split AC, Smart TV, Ergonomic Chair, Attached Bath'),
(5, 2, 'Double Sharing Non-AC', 2, 16, 4, 8500.00, 6000.00, 'Individual Cupboards, Fast Wi-Fi, Attached Washroom'),

(6, 3, 'Single Room with Balcony', 1, 5, 2, 16000.00, 10000.00, 'Sunlit balcony, Wardrobe, Dressing Mirror, Attached Bath'),
(7, 3, 'Double Sharing Luxury', 2, 24, 7, 9500.00, 6000.00, 'Twin Beds, Individual Desks, Geyser, High Security'),
(8, 3, 'Triple Sharing Economy', 3, 18, 4, 8000.00, 5000.00, 'Spacious room, 3 Cupboards, Clean Washroom'),

(9, 4, 'Studio Private Suite', 1, 8, 3, 18000.00, 15000.00, 'Private Kitchenette, AC, Smart TV, Premium Bedding'),
(10, 4, 'Double Sharing Loft', 2, 12, 4, 11000.00, 10000.00, 'Modern Industrial Decor, Fast Fiber Net, Attached Bath'),

(11, 5, 'Double Sharing Basic', 2, 14, 6, 6500.00, 4000.00, 'Daily cleaning, Wi-Fi, Food Included'),
(12, 5, 'Triple Sharing Budget', 3, 24, 9, 5500.00, 4000.00, 'Affordable, Good food, Hot water'),

(13, 6, 'Executive Single AC', 1, 10, 3, 13500.00, 8000.00, 'AC, Workstation Desk, Power Backup, High-speed Net'),
(14, 6, 'Double Sharing Standard', 2, 20, 6, 7000.00, 5000.00, 'Comfortable beds, Lockers, Laundry service');

-- 8. Reviews
INSERT INTO reviews (id, user_id, property_id, rating, comment) VALUES
(1, 4, 1, 5, 'Awesome stay! The food is actually really good compared to usual PGs in BTM, and the Wi-Fi speed is solid for work from home.'),
(2, 5, 3, 5, 'Very safe environment for girls in HSR. The warden is very polite and helpful. Clean rooms and daily housekeeping.'),
(3, 4, 2, 4, 'Great location in Koramangala near all cafes and offices. Management is responsive when any repair is needed.');

-- 9. Sample Bookings
INSERT INTO bookings (id, user_id, property_id, room_type_id, move_in_date, beds_count, total_rent, deposit_amount, status, user_notes) VALUES
(1, 4, 1, 2, '2026-12-01', 1, 8500.00, 5000.00, 'CONFIRMED', 'Looking forward to move in on 1st Dec. Working at Flipkart.'),
(2, 5, 3, 7, '2026-12-05', 1, 9500.00, 6000.00, 'PENDING', 'Need a room on the 2nd floor if possible.');

-- 10. Sample Wishlist
INSERT INTO wishlist_items (id, user_id, property_id) VALUES
(1, 4, 2),
(2, 4, 4),
(3, 5, 1);
