package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.request.NotificationsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.NotificationsResponse;
import com.seikyuuressha.aptfeemanagement.entity.Notifications;
import com.seikyuuressha.aptfeemanagement.entity.Residents;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.NotificationMapper;
import com.seikyuuressha.aptfeemanagement.repository.NotificationRepository;
import com.seikyuuressha.aptfeemanagement.repository.ResidentsRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    NotificationRepository notificationRepository;
    NotificationMapper notificationMapper;
    ResidentsRepository residentsRepository;

    @PreAuthorize("hasRole('admin')")
    public NotificationsResponse createNotification(NotificationsRequest request) {
        List<Residents> residents = residentsRepository.findAllById(request.getResidentIds());
        if (residents.size() != request.getResidentIds().size()) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        Notifications n = notificationMapper.toEntity(request);
        n.setMessage(request.getMessage());
        n.setResidents(new HashSet<>(residents));
        n.setCreatedAt(LocalDateTime.now());
        n = notificationRepository.save(n);
        return notificationMapper.toResponse(n);
    }

    public List<NotificationsResponse> getAllNotifications() {
        return notificationRepository.findAll().stream().map(notificationMapper::toResponse).toList();
    }

    public NotificationsResponse getNotification(String notificationId) {
        Notifications n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        return notificationMapper.toResponse(n);
    }
}