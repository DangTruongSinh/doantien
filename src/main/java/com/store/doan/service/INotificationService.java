package com.store.doan.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.store.doan.dto.NotificationDTO;

public interface INotificationService {
	
	Page<NotificationDTO> findAllIsViewed(Long idUser, boolean isViewed, Pageable pageable);
	
	void delete(Long id);
	
	void createNotification(Long orderId, String status);
}
