package com.staywise.auth;

import com.staywise.auth.dto.AuthRequest;
import com.staywise.auth.dto.AuthResponse;
import com.staywise.auth.dto.RegisterRequest;
import com.staywise.common.exception.BadRequestException;
import com.staywise.common.response.ApiResponse;
import com.staywise.owner.OwnerProfile;
import com.staywise.owner.OwnerProfileRepository;
import com.staywise.security.CustomUserDetailsService;
import com.staywise.security.JwtService;
import com.staywise.user.User;
import com.staywise.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final OwnerProfileRepository ownerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(
            UserRepository userRepository,
            OwnerProfileRepository ownerProfileRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            CustomUserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.ownerProfileRepository = ownerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, user.getRole(), user.getId());

        AuthResponse response = new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getRole()
        );

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        String role = request.getRole() != null && request.getRole().equalsIgnoreCase("ROLE_OWNER")
                ? "ROLE_OWNER"
                : "ROLE_STUDENT";

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhoneNumber(),
                role
        );
        user = userRepository.save(user);

        if ("ROLE_OWNER".equals(role)) {
            String businessName = request.getBusinessName() != null && !request.getBusinessName().isBlank()
                    ? request.getBusinessName()
                    : request.getFullName() + "'s PG Accommodations";
            OwnerProfile profile = new OwnerProfile(user, businessName, null, null, null, false);
            ownerProfileRepository.save(profile);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, user.getRole(), user.getId());

        AuthResponse response = new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getRole()
        );

        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadRequestException("Not authenticated");
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BadRequestException("User not found"));

        AuthResponse response = new AuthResponse(
                null,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getRole()
        );

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
