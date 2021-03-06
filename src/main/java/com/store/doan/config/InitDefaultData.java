package com.store.doan.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.transaction.annotation.Transactional;

import com.store.doan.constant.MessageOrderItem;
import com.store.doan.constant.OrderStatusConstant;
import com.store.doan.constant.QuotationStatusConstant;
import com.store.doan.constant.RoleConstant;
import com.store.doan.dto.UserDTO;
import com.store.doan.model.Notification;
import com.store.doan.model.OrderStatus;
import com.store.doan.model.QuotationStatus;
import com.store.doan.model.Role;
import com.store.doan.repository.NotificationRepository;
import com.store.doan.repository.OrderStatusRepository;
import com.store.doan.repository.QuotationStatusRepository;
import com.store.doan.repository.RoleRepository;
import com.store.doan.service.IUserService;
import com.store.doan.utils.UtilsCommon;

@Configuration
public class InitDefaultData {
	
	@Value("${spring.profiles.active}")
	String profile;
	
	@Autowired
	RoleRepository roleRepository;
	
	@Autowired
	OrderStatusRepository orderStatusRepository;
	
	@Autowired
	QuotationStatusRepository quotationStatusRepository;
	
	@Autowired
	IUserService iUserService;
	
	@Autowired
	NotificationRepository notificationRepository;

	@Autowired
	UtilsCommon utilsCommon;
	
	static final Logger logger = LoggerFactory.getLogger(InitDefaultData.class);
	
	@EventListener
	@Transactional
	public void appReady(ApplicationReadyEvent event) {
		logger.info("app ready!");
		if(profile.equals("initdata")) {
			logger.info("init default data!");
			initRole();
			initNameOrderStatus();
			initNameQuotationStatus();
			initCreateNewUser();
			initMessageNotification();
			logger.info("init default data  success!");
		}
	}
	
	private void initMessageNotification() {
		Notification notification2 = new Notification(MessageOrderItem.NOTIFICATION_ORDERED_ITEM_WAIT_PROCESS);
		notification2.setKeyName(OrderStatusConstant.WaitProcess.name());
		Notification notification3= new Notification(MessageOrderItem.NOTIFICATION_ORDERED_ITEM_PROCESSING);
		notification3.setKeyName(OrderStatusConstant.Processing.name());
		Notification notification4= new Notification(MessageOrderItem.NOTIFICATION_ORDERED_ITEM_FINISHED_PROCESS);
		notification4.setKeyName(OrderStatusConstant.FishedProcess.name());
		Notification notification5= new Notification(MessageOrderItem.NOTIFICATION_ORDERED_ITEM_WAIT_SHIP);
		notification5.setKeyName(OrderStatusConstant.WaitShip.name());
		Notification notification6= new Notification(MessageOrderItem.NOTIFICATION_ORDERED_ITEM_FINISHED_SHIP);
		
		notificationRepository.save(notification2);
		notificationRepository.save(notification3);
		notificationRepository.save(notification4);
		notificationRepository.save(notification5);
		notificationRepository.save(notification6);
	}
	private void initCreateNewUser() {
		// TODO Auto-generated method stub
		UserDTO userDTO1 = new UserDTO("tien", "123456", "Võ Thị Mỹ Tiên", "01234", RoleConstant.ADMIN.name());
		iUserService.createNew(userDTO1);
	}

	private void initNameQuotationStatus() {
		// TODO Auto-generated method stub
		QuotationStatus confirm = new QuotationStatus(QuotationStatusConstant.CONFIRM.name());
		QuotationStatus reject = new QuotationStatus(QuotationStatusConstant.REJECT.name());
		QuotationStatus unknown = new QuotationStatus(QuotationStatusConstant.UNKNOWN.name());
		quotationStatusRepository.save(confirm);
		quotationStatusRepository.save(reject);
		quotationStatusRepository.save(unknown);
	}

	private void initNameOrderStatus() {
		// TODO Auto-generated method stub
		OrderStatus waitProcess = new OrderStatus(OrderStatusConstant.WaitProcess.getValue());
		OrderStatus processing = new OrderStatus(OrderStatusConstant.Processing.getValue());
		OrderStatus fishedProcess = new OrderStatus(OrderStatusConstant.FishedProcess.getValue());
		OrderStatus shipping = new OrderStatus(OrderStatusConstant.WaitShip.getValue());
		
		orderStatusRepository.save(waitProcess);
		orderStatusRepository.save(processing);
		orderStatusRepository.save(fishedProcess);
		orderStatusRepository.save(shipping);
	}

	private void initRole() {
		// TODO Auto-generated method stub
		Role admin = new Role(RoleConstant.ADMIN.name());
		Role management = new Role(RoleConstant.MANAGER.name());
		Role engineering = new Role(RoleConstant.ENGINEERING.name());
		roleRepository.save(admin);
		roleRepository.save(management);
		roleRepository.save(engineering);
	}
}
