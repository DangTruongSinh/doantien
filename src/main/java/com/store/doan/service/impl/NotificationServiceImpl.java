package com.store.doan.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.store.doan.constant.MessageError;
import com.store.doan.constant.OrderStatusConstant;
import com.store.doan.constant.RoleConstant;
import com.store.doan.dto.NotificationDTO;
import com.store.doan.exception.NotFoundException;
import com.store.doan.model.Notification;
import com.store.doan.model.OrderedItem;
import com.store.doan.model.User;
import com.store.doan.model.UserNotification;
import com.store.doan.repository.NotificationRepository;
import com.store.doan.repository.OrderedItemRepository;
import com.store.doan.repository.UserNotificationRepository;
import com.store.doan.repository.UserRepository;
import com.store.doan.service.INotificationService;

@Service
@Transactional
public class NotificationServiceImpl implements  INotificationService{

	@Autowired
	NotificationRepository notificationRepository;
	
	@Autowired
	UserNotificationRepository userNotificationRepository;
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	OrderedItemRepository orderedItemRepository;
	
	@Override
	public Page<NotificationDTO> findAllIsViewed(Long idUser, boolean isViewed, Pageable pageable) {
		Page<UserNotification> page = userNotificationRepository.findByUserIdAndIsViewedIsOrderByDateCreateDesc(idUser, pageable, isViewed);
		List<NotificationDTO> notificationDTOs = new ArrayList<NotificationDTO>();
		page.getContent().forEach(notification -> {
			NotificationDTO notificationDTO = new NotificationDTO();
			notificationDTO.setId(notification.getId());
			notificationDTO.setIdQuotation(notification.getOrderedItem().getQuotation().getId());
			notificationDTO.setIdOrderedItem(notification.getOrderedItem().getId());
			notificationDTO.setBoCode(notification.getOrderedItem().getQuotation().getBoCode());
			notificationDTO.setContent(notification.getNotification().getContent());
			notificationDTO.setIdQuotation((notification.getOrderedItem().getQuotation().getId()));
			notificationDTO.setViewed(notification.isViewed());
			notificationDTO.setDateCreated(notification.getDateCreate());
			notificationDTO.setIdUser(notification.getUser().getId());
			notificationDTOs.add(notificationDTO);
		});
		return new PageImpl<NotificationDTO>(notificationDTOs, pageable, page.getTotalElements());
	}

	@Override
	public void delete(Long id, Long idUser) {
		// TODO Auto-generated method stu
		userNotificationRepository.deleteByOrderId(id, idUser);
	}

	@Override
	public void createNotification(Long idUser,Long orderId, String status) {
		// TODO Auto-generated method stub
		List<User> users = userRepo.findByNotIdUser(idUser);
		String keyName = null;
		if(status.equals(OrderStatusConstant.WaitProcess.getValue())) {
			keyName = OrderStatusConstant.WaitProcess.name();
		} else if(status.equals(OrderStatusConstant.Processing.getValue())){
			keyName = OrderStatusConstant.Processing.name();
		} else if(status.equals(OrderStatusConstant.FishedProcess.getValue())){
			keyName = OrderStatusConstant.FishedProcess.name();
		} else if(status.equals(OrderStatusConstant.WaitShip.getValue())){
			keyName = OrderStatusConstant.WaitShip.name();
		} 
		if(keyName != null) {
			Notification notification =  notificationRepository.findByKeyName(keyName).orElseThrow(() -> new NotFoundException(MessageError.NOTIFICATION_NOT_FOUND));
			OrderedItem oderedItem = orderedItemRepository.findById(orderId).orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
			for(User u : users) {
				if(!u.getRole().getName().equals(RoleConstant.ENGINEERING.name())) {
					saveNotification(notification, oderedItem, u);
				}else {
					if(keyName.equals(OrderStatusConstant.WaitProcess.name()) 
							|| keyName.equals(OrderStatusConstant.Processing.name())
							|| keyName.equals(OrderStatusConstant.FishedProcess.name())) {
						saveNotification(notification, oderedItem, u);
					}
				}	
			}
		}
		
	}

	private void saveNotification(Notification notification, OrderedItem oderedItem, User u) {
		UserNotification userNotification = new UserNotification();
		userNotification.setUser(u);
		userNotification.setViewed(false);
		userNotification.setOrderedItem(oderedItem);
		userNotification.setNotification(notification);
		userNotificationRepository.save(userNotification);
	}

	@Override
	public void deleteNo(Long id) {
		// TODO Auto-generated method stub
		userNotificationRepository.deleteById(id);
	}

}
