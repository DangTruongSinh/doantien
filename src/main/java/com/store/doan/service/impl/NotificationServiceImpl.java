package com.store.doan.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.store.doan.dto.NotificationDTO;
import com.store.doan.model.UserNotification;
import com.store.doan.repository.NotificationRepository;
import com.store.doan.repository.UserNotificationRepository;
import com.store.doan.service.INotificationService;

@Service
@Transactional
public class NotificationServiceImpl implements  INotificationService{

	@Autowired
	NotificationRepository notificationRepository;
	
	@Autowired
	UserNotificationRepository userNotificationRepository;

	@Override
	public Page<NotificationDTO> findAllIsViewed(Long idUser, boolean isViewed, Pageable pageable) {
		Page<UserNotification> page = userNotificationRepository.findByUserId(idUser, pageable);
		List<NotificationDTO> notificationDTOs = new ArrayList<NotificationDTO>();
		page.getContent().forEach(notification -> {
			NotificationDTO notificationDTO = new NotificationDTO();
			notificationDTO.setId(notification.getId());
			notificationDTO.setBoCode(notification.getOrderedItem().getQuotation().getBoCode());
			notificationDTO.setContent(notification.getNotification().getContent());
			notificationDTO.setIdOrderedItem(notification.getOrderedItem().getId());
			notificationDTO.setViewed(notification.isViewed());
			notificationDTOs.add(notificationDTO);
		});
		return new PageImpl<NotificationDTO>(notificationDTOs, pageable, page.getNumberOfElements());
	}

	@Override
	public void delete(Long id, Long idUser) {
		// TODO Auto-generated method stub
		userNotificationRepository.deleteByUserIdAndOrderedItemId(idUser, id);
	}

}
