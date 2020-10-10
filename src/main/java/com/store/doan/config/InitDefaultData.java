package com.store.doan.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.transaction.annotation.Transactional;

import com.store.doan.constant.OrderStatusConstant;
import com.store.doan.constant.QuotationStatusConstant;
import com.store.doan.constant.RoleConstant;
import com.store.doan.dto.UserDTO;
import com.store.doan.model.OrderStatus;
import com.store.doan.model.QuotationStatus;
import com.store.doan.model.Role;
import com.store.doan.repository.OrderStatusRepository;
import com.store.doan.repository.QuotationStatusRepository;
import com.store.doan.repository.RoleRepository;
import com.store.doan.service.IUserService;

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
			logger.info("init default data  success!");
		}
	}

	private void initCreateNewUser() {
		// TODO Auto-generated method stub
		UserDTO userDTO = new UserDTO("tien", "abc", "Võ Thị Mỹ Tiên", "01234", RoleConstant.ADMIN.name());
		iUserService.createNew(userDTO);
	}

	private void initNameQuotationStatus() {
		// TODO Auto-generated method stub
		QuotationStatus confirm = new QuotationStatus(QuotationStatusConstant.Confirm.getValue());
		QuotationStatus reject = new QuotationStatus(QuotationStatusConstant.Reject.getValue());
		quotationStatusRepository.save(confirm);
		quotationStatusRepository.save(reject);
	}

	private void initNameOrderStatus() {
		// TODO Auto-generated method stub
		OrderStatus waitHandle = new OrderStatus(OrderStatusConstant.WaitHandle.getValue());
		OrderStatus waitProcess = new OrderStatus(OrderStatusConstant.WaitProcess.getValue());
		OrderStatus processing = new OrderStatus(OrderStatusConstant.Processing.getValue());
		OrderStatus fishedProcess = new OrderStatus(OrderStatusConstant.FishedProcess.getValue());
		OrderStatus shipping = new OrderStatus(OrderStatusConstant.Ship.getValue());
		OrderStatus fishedShpping = new OrderStatus(OrderStatusConstant.FishedShip.getValue());
		
		orderStatusRepository.save(waitHandle);
		orderStatusRepository.save(waitProcess);
		orderStatusRepository.save(processing);
		orderStatusRepository.save(fishedProcess);
		orderStatusRepository.save(shipping);
		orderStatusRepository.save(fishedShpping);
	}

	private void initRole() {
		// TODO Auto-generated method stub
		Role admin = new Role(RoleConstant.ADMIN.name());
		Role management = new Role(RoleConstant.MANAGEMENT.name());
		Role engineering = new Role(RoleConstant.ENGINEERING.name());
		roleRepository.save(admin);
		roleRepository.save(management);
		roleRepository.save(engineering);
	}
}
