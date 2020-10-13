package com.store.doan.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.store.doan.constant.MessageError;
import com.store.doan.constant.MessageHistory;
import com.store.doan.constant.OrderStatusConstant;
import com.store.doan.constant.QuotationStatusConstant;
import com.store.doan.constant.RoleConstant;
import com.store.doan.dto.QuotationDTO;
import com.store.doan.exception.NotFoundException;
import com.store.doan.model.HistoryOrders;
import com.store.doan.model.HistoryQuotation;
import com.store.doan.model.Notification;
import com.store.doan.model.OrderStatus;
import com.store.doan.model.OrderedItem;
import com.store.doan.model.Quotation;
import com.store.doan.model.QuotationStatus;
import com.store.doan.model.RejectedItem;
import com.store.doan.model.User;
import com.store.doan.model.UserNotification;
import com.store.doan.repository.HistoryOrderRepository;
import com.store.doan.repository.HistoryQuotationRepository;
import com.store.doan.repository.NotificationRepository;
import com.store.doan.repository.OrderStatusRepository;
import com.store.doan.repository.OrderedItemRepository;
import com.store.doan.repository.QuotationRepository;
import com.store.doan.repository.QuotationStatusRepository;
import com.store.doan.repository.RejectedItemRepository;
import com.store.doan.repository.UserNotificationRepository;
import com.store.doan.repository.UserRepository;
import com.store.doan.service.IQuotationService;
import com.store.doan.utils.UtilsCommon;

@Service
@Transactional
public class QuotationServiceImpl implements IQuotationService {

	@Autowired
	QuotationRepository quotationRepository;

	@Autowired
	HistoryQuotationRepository historyQuotationRepository;

	@Autowired
	OrderedItemRepository orderedItemRepository;

	@Autowired
	HistoryOrderRepository historyOrderRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	QuotationStatusRepository quotationStatusRepository;

	@Autowired
	OrderStatusRepository orderStatusRepository;

	@Autowired
	RejectedItemRepository rejectedItemRepository;

	@Autowired
	NotificationRepository notificationRepository;

	@Autowired
	UserNotificationRepository userNotificationRepository;
	
	@Autowired
	UtilsCommon utilsCustom;

	static final Logger logger = LoggerFactory.getLogger(QuotationServiceImpl.class);

	@Override
	public QuotationDTO createNew(QuotationDTO quotationDTO, Long idUser) {
		if (quotationDTO.getQuotationStatus().equals(QuotationStatusConstant.REJECT.name())) {
			return null;
		}

		Quotation quotation = new Quotation();
		BeanUtils.copyProperties(quotationDTO, quotation);
		// save history
		HistoryQuotation historyQuotation = new HistoryQuotation();
		User user = userRepository.findById(idUser)
				.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		historyQuotation.setUser(user);
		historyQuotation.setQuotation(quotation);

		QuotationStatus qstatus;
		if (quotationDTO.getQuotationStatus().equals(QuotationStatusConstant.UNKNOWN.name())) {
			qstatus = quotationStatusRepository.findByName(QuotationStatusConstant.UNKNOWN.getValue());
			historyQuotation.setContent(MessageHistory.QUOTATION_CREATED_STATUS_UNKNOWN);
		} else {

			qstatus = quotationStatusRepository.findByName(QuotationStatusConstant.CONFIRM.getValue());
			historyQuotation.setContent(MessageHistory.QUOTATION_CREATED_STATUS_ACCEPT);
			// create new Ordered item
			createNewOrderedItem(quotationDTO, idUser, quotation, user);
		}
		quotation.setQStatus(qstatus);
		quotationRepository.saveAndFlush(quotation);
		historyQuotationRepository.save(historyQuotation);
		logger.info("user id: {} had save success quotation with id {}", idUser, quotation.getId());
		quotationDTO.setId(quotation.getId());
		return quotationDTO;
	}

	private void createNewOrderedItem(QuotationDTO quotationDTO, Long idUser, Quotation quotation, User user) {
		OrderedItem orderedItem = new OrderedItem();
		OrderStatus orStatus = orderStatusRepository.findByName(OrderStatusConstant.WaitProcess.getValue());
		orderedItem.setStatus(orStatus);
		orderedItem.setQuotation(quotation);
		List<User> users = userRepository.findByRoleNameNot(RoleConstant.ENGINEERING.name());
		Notification notification = notificationRepository.findByKeyName(OrderStatusConstant.WaitHandle.name()).orElseThrow(() -> new NotFoundException("notification not found!"));
		orderedItemRepository.save(orderedItem);

		// save history order
		createNewHistoryOrder(user, users, orderedItem, notification, MessageHistory.ORDERED_ITEM_CREATED);
		// send Mail
		utilsCustom.sendEmail(quotationDTO.getEmail(), "");
		logger.info("user id: {} had save success order with id {}", idUser, orderedItem.getId());
	}

	private void createNewHistoryOrder(User user, List<User> users, OrderedItem orderedItem, Notification notification, String message) {
		
		HistoryOrders historyOrders = new HistoryOrders();
		historyOrders.getHistoryQuotation().setUser(user);
		historyOrders.setOrderedItem(orderedItem);
		historyOrders.getHistoryQuotation().setContent(message);
		historyOrderRepository.save(historyOrders);
		// create notification for each user in system( engineering don't have notification
		
		for(User u : users) {
			// save user notification
			UserNotification userNotification = new UserNotification();
			userNotification.setNotification(notification);
			userNotification.setUser(u);
			userNotification.setViewed(false);
			userNotification.setOrderedItem(orderedItem);
			userNotificationRepository.save(userNotification);
		}
		
		
		
		
	}

	@Override
	public QuotationDTO update(QuotationDTO quotationDTO, Long idUser) {
		// TODO Auto-generated method stub
		Quotation quotation = quotationRepository.findById(quotationDTO.getId())
				.orElseThrow(() -> new NotFoundException(MessageError.QUOTATION_NOT_FOUND));
		HistoryQuotation historyQuotation = new HistoryQuotation();
		User user = userRepository.findById(idUser)
				.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		historyQuotation.setUser(user);
		historyQuotation.setQuotation(quotation);
		StringBuilder contentHistoryQuotation = new StringBuilder();
		contentHistoryQuotation.append(MessageHistory.QUOTATION_CHANGE);
		if (!quotation.getQStatus().getName().equals(quotationDTO.getQuotationStatus())) {
			contentHistoryQuotation.append(" Tình trạng:");
			contentHistoryQuotation.append(quotation.getQStatus().getName());
			contentHistoryQuotation.append(" -> ");
			contentHistoryQuotation.append(quotationDTO.getQuotationStatus());
		}
		if (quotationDTO.getQuotationStatus().equals(QuotationStatusConstant.CONFIRM.name())) {
			Optional<OrderedItem> orderedItem = orderedItemRepository.findByQuotationId(quotationDTO.getId());
			if (orderedItem.isPresent()) {
				StringBuilder builderHistoryOrder = new StringBuilder();
				builderHistoryOrder.append(MessageHistory.ORDERED_ITEM_UPDATED);
				boolean result = checkChangeValue(quotationDTO, quotation, builderHistoryOrder);
				// if change create new a history
				if (result) {
//					createNewHistoryOrder(user, orderedItem.get(), builderHistoryOrder.toString());
				}
			} else {
				createNewOrderedItem(quotationDTO, idUser, quotation, user);
			}
		}
		checkChangeValue(quotationDTO, quotation, contentHistoryQuotation);
		historyQuotation.setContent(contentHistoryQuotation.toString());
		historyQuotationRepository.save(historyQuotation);
		BeanUtils.copyProperties(quotationDTO, quotation);
		quotationRepository.save(quotation);
		logger.info("user id: {}  updated success quotation with id {}", idUser, quotation.getId());
		return quotationDTO;
	}

	private boolean checkChangeValue(QuotationDTO quotationDTO, Quotation quotation, StringBuilder contentChange) {
		// TODO Auto-generated method stub
		boolean flag = false;
		if (!quotationDTO.getBoCode().equals(quotation.getBoCode())) {
			contentChange.append(" Mã BO:");
			contentChange.append(quotation.getBoCode());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getBoCode());
			flag = true;
		} else if (!quotationDTO.getEmail().equals(quotation.getEmail())) {
			contentChange.append(" .Email:");
			contentChange.append(quotation.getEmail());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getEmail());
			flag = true;
		} else if (!quotationDTO.getNameOfCustomer().equals(quotation.getNameOfCustomer())) {
			contentChange.append(" .Tên khách:");
			contentChange.append(quotation.getNameOfCustomer());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getNameOfCustomer());
			flag = true;
		} else if (!quotationDTO.getPhoneNumber().equals(quotation.getPhoneNumber())) {
			contentChange.append(" .Số điện thoại:");
			contentChange.append(quotation.getPhoneNumber());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getPhoneNumber());
			flag = true;
		} else if (!quotationDTO.getPrice().equals(quotation.getPrice())) {
			contentChange.append(" .Giá:");
			contentChange.append(quotation.getPrice());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getPrice());
			flag = true;
		} else if (quotationDTO.getQuantity() != quotation.getQuantity()) {
			contentChange.append(" .Số lượng:");
			contentChange.append(quotation.getQuantity());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getQuantity());
			flag = true;
		}

		return flag;
	}

	@Override
	public void deleteNotByAdmin(Long id, Long idUser) {
		// TODO Auto-generated method stub
		Quotation quotation = quotationRepository.findById(id)
				.orElseThrow(() -> new NotFoundException(MessageError.QUOTATION_NOT_FOUND));
		quotation.setDeleted(true);
		quotationRepository.save(quotation);
		logger.info("user id: {} had change status quotation to delete with id {}", idUser, id);
	}

	@Override
	public void delete(Long id, Long idUser) {
		// TODO Auto-generated method stub
		Quotation quotation = quotationRepository.findById(id)
				.orElseThrow(() -> new NotFoundException(MessageError.QUOTATION_NOT_FOUND));
		if (quotation.getQStatus().getName().equals(QuotationStatusConstant.CONFIRM.getValue())) {
			OrderedItem orderedItem = orderedItemRepository.findByQuotationId(id)
					.orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
			orderedItemRepository.delete(orderedItem);
			logger.info("user id: {} had  delete ordered item with id {}", idUser, id);
		} else if (quotation.getQStatus().getName().equals(QuotationStatusConstant.REJECT.getValue())) {
			RejectedItem rejectedItem = rejectedItemRepository.findByQuotationId(id)
					.orElseThrow(() -> new NotFoundException(MessageError.REJECTED_ITEM_NOT_FOUND));
			rejectedItemRepository.delete(rejectedItem);
			logger.info("user id: {} had  delete reject item with id {}", idUser, id);
		}
		quotationRepository.delete(quotation);
		logger.info("user id: {} had  delete quotation with id {}", idUser, id);
	}

	@Override
	public Page<QuotationDTO> find(String nameOfCustomer, Pageable pageable) {
		// TODO Auto-generated method stub
		nameOfCustomer = UtilsCommon.concatString("%", nameOfCustomer, "%");
		Page<Quotation> pageQuotations = quotationRepository.findByNameOfCustomerLike(nameOfCustomer, pageable);
		List<QuotationDTO> quotationDTOs = new ArrayList<QuotationDTO>();
		pageQuotations.getContent().forEach(quotation -> {
			QuotationDTO quotationDTO = new QuotationDTO();
			BeanUtils.copyProperties(quotation, quotationDTO);
			quotationDTOs.add(quotationDTO);
		});
		return new PageImpl<QuotationDTO>(quotationDTOs, pageable, pageQuotations.getTotalElements());
	}

}
