package com.seikyuuressha.aptfeemanagement.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import com.seikyuuressha.aptfeemanagement.dto.request.AuthenticationRequest;
import com.seikyuuressha.aptfeemanagement.dto.request.IntrospectTokenRequest;
import com.seikyuuressha.aptfeemanagement.dto.request.LogoutRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.AuthenticationResponse;
import com.seikyuuressha.aptfeemanagement.dto.response.IntrospectTokenResponse;
import com.seikyuuressha.aptfeemanagement.entity.InvalidateToken;
import com.seikyuuressha.aptfeemanagement.entity.Residents;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.repository.InvalidateTokenRepository;
import com.seikyuuressha.aptfeemanagement.repository.ResidentsRepository;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    ResidentsRepository residentsRepository;
    InvalidateTokenRepository invalidateTokenRepository;
    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;
    @NonFinal
    @Value("${jwt.refresh-duration}")
    protected long REFRESH_DURATION;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(15);
        var resident = residentsRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), resident.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);
        var token = generateToken(resident);

        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    private String generateToken(Residents resident) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(resident.getEmail())
                .issuer("astral.express")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.HOURS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(resident))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(Residents resident) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (resident.getMyRole() != null && !resident.getMyRole().isEmpty()) {
            stringJoiner.add("ROLE_" + resident.getMyRole());
        }

        return stringJoiner.toString();
    }

    public IntrospectTokenResponse introspect(IntrospectTokenRequest request)
            throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectTokenResponse.builder()
                .valid(isValid)
                .build();
    }

    public void logOut(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signedToken = verifyToken(request.getToken(), false);

            String jit = signedToken.getJWTClaimsSet().getJWTID();
            Date expirationDate = signedToken.getJWTClaimsSet().getExpirationTime();
            InvalidateToken invalidateToken = InvalidateToken.builder()
                    .tokenId(jit)
                    .expiryDate(expirationDate)
                    .build();

            invalidateTokenRepository.save(invalidateToken);
        } catch (AppException e) {
            log.error("Token already expired. ", e);
        }
    }

    public SignedJWT verifyToken(String token, boolean isRefresh) throws ParseException, JOSEException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        if (new Date().after(signedJWT.getJWTClaimsSet().getExpirationTime())) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }

        if (isRefresh) {
            Date iat = signedJWT.getJWTClaimsSet().getIssueTime();
            Date refreshExpiry = Date.from(iat.toInstant().plus(REFRESH_DURATION, ChronoUnit.HOURS));
            if (new Date().after(refreshExpiry)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
        }

        // Token verified?
        var verified = signedJWT.verify(verifier);
        if (!verified) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Token revoked?
        if (invalidateTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }

    public AuthenticationResponse refreshToken(IntrospectTokenRequest request)
            throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expirationDate = signedJWT.getJWTClaimsSet().getExpirationTime();
        InvalidateToken invalidateToken = InvalidateToken.builder()
                .tokenId(jit)
                .expiryDate(expirationDate)
                .build();
        invalidateTokenRepository.save(invalidateToken);

        var email = signedJWT.getJWTClaimsSet().getSubject();
        var resident = residentsRepository.findByEmail(email).orElseThrow(
                () -> new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateToken(resident);
        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }
}