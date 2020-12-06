package com.store.doan.service.impl;

import java.time.LocalDateTime;
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
import com.store.doan.constant.TypeAction;
import com.store.doan.dto.QuotationDTO;
import com.store.doan.exception.NotFoundException;
import com.store.doan.model.HistoryQuotation;
import com.store.doan.model.Notification;
import com.store.doan.model.OrderStatus;
import com.store.doan.model.OrderedItem;
import com.store.doan.model.Quotation;
import com.store.doan.model.QuotationStatus;
import com.store.doan.model.RejectedItem;
import com.store.doan.model.User;
import com.store.doan.model.UserNotification;
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
	
	@Autowired
	UtilsCommon utilsCommon;

	static final Logger logger = LoggerFactory.getLogger(QuotationServiceImpl.class);

	@Override
	public QuotationDTO createNew(QuotationDTO quotationDTO, Long idUser) {

		Quotation quotation = new Quotation();
		BeanUtils.copyProperties(quotationDTO, quotation);
		// save history
		HistoryQuotation historyQuotation = new HistoryQuotation();
		User user = userRepository.findById(idUser)
				.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		historyQuotation.setUser(user);
		historyQuotation.setQuotation(quotation);
		historyQuotation.setAction(TypeAction.CREATE.name());
		QuotationStatus qstatus;
		// create new
		if (quotationDTO.getQuotationStatus().equals(QuotationStatusConstant.UNKNOWN.name())) {
			qstatus = quotationStatusRepository.findByName(QuotationStatusConstant.UNKNOWN.name());
			historyQuotation.setContent(MessageHistory.QUOTATION_CREATED_STATUS_UNKNOWN);
			quotation.setQuotationStatus(qstatus);
			quotationRepository.saveAndFlush(quotation);
			historyQuotationRepository.saveAndFlush(historyQuotation);
		} else if (quotationDTO.getQuotationStatus().equals(QuotationStatusConstant.CONFIRM.name())) {
			createNewOrderedItem(quotationDTO, idUser, quotation, user, historyQuotation, false);
		} else {
			createNewRejectedItem(quotationDTO, quotation, historyQuotation, false);
		}

		logger.info("user id: {} had save success quotation with id {}", idUser, quotation.getId());
		quotationDTO.setId(quotation.getId());
		quotationDTO.setCreatedDate(quotation.getCreatedDate());
		return quotationDTO;
	}

	private void createNewRejectedItem(QuotationDTO quotationDTO, Quotation quotation,
			HistoryQuotation historyQuotation, boolean isUpdate) {
		QuotationStatus qstatus;
		qstatus = quotationStatusRepository.findByName(QuotationStatusConstant.REJECT.name());
		// create new Ordered item
		quotation.setQuotationStatus(qstatus);
		quotationRepository.saveAndFlush(quotation);
		// reject quotation
		RejectedItem rejectedItem = new RejectedItem();
		rejectedItem.setQuotation(quotation);
		rejectedItem.setReason(quotationDTO.getReason());
		rejectedItemRepository.save(rejectedItem);
		// save history
		if (!isUpdate) {
			historyQuotation.setContent(MessageHistory.QUOTATION_CREATED_STATUS_REJECT);
			historyQuotationRepository.saveAndFlush(historyQuotation);
		}
	}

	private void createNewOrderedItem(QuotationDTO quotationDTO, Long idUser, Quotation quotation, User user,
			HistoryQuotation quotationHistories, boolean isUpdate) {
		if (!isUpdate) {

			QuotationStatus qstatus = quotationStatusRepository.findByName(QuotationStatusConstant.CONFIRM.name());
			quotationHistories.setContent(MessageHistory.QUOTATION_CREATED_STATUS_ACCEPT);
			// create new Ordered item
			quotation.setQuotationStatus(qstatus);
			quotationRepository.saveAndFlush(quotation);
			historyQuotationRepository.saveAndFlush(quotationHistories);
		}
		OrderedItem orderedItem = new OrderedItem();
		OrderStatus orStatus = orderStatusRepository.findByName(OrderStatusConstant.WaitProcess.getValue());
		orderedItem.setStatus(orStatus);
		orderedItem.setQuotation(quotation);
		orderedItem.setDeliveryDate(quotationDTO.getDeliveryDate());
		orderedItem.setOrderDate(LocalDateTime.now());
		List<User> users = userRepository.findByRoleNameNot(RoleConstant.ENGINEERING.name());
		Notification notification = notificationRepository.findByKeyName(OrderStatusConstant.WaitProcess.name())
				.orElseThrow(() -> new NotFoundException("notification not found!"));
		orderedItemRepository.save(orderedItem);

		// save notification
		createNewNotifications(user, users, orderedItem, notification, MessageHistory.ORDERED_ITEM_CREATED);
		// send Mail
		utilsCustom.sendEmail(user.getUsername(), quotationDTO.getBoCode(), OrderStatusConstant.WaitProcess.getValue());
		logger.info("user id: {} had save success order with id {}", idUser, orderedItem.getId());
	}

	private void createNewNotifications(User user, List<User> users, OrderedItem orderedItem, Notification notification,
			String message) {

		// create notification for each user in system( engineering don't have
		// notification

		for (User u : users) {
			if (!u.getRole().getName().equals(RoleConstant.ENGINEERING.name())) {
				saveNotification(notification, orderedItem, u);
			} else {
				if (orderedItem.getStatus().getName().equals(OrderStatusConstant.WaitProcess.getValue())
						|| orderedItem.getStatus().getName().equals(OrderStatusConstant.Processing.getValue())
						|| orderedItem.getStatus().getName().equals(OrderStatusConstant.FishedProcess.getValue())) {
					saveNotification(notification, orderedItem, u);
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
	public QuotationDTO update(QuotationDTO quotationDTO, Long idUser) {
		// TODO Auto-generated method stub
		Quotation quotation = quotationRepository.findById(quotationDTO.getId())
				.orElseThrow(() -> new NotFoundException(MessageError.QUOTATION_NOT_FOUND));
		OrderedItem orderedItem2 = quotation.getOrderedItem();
		if(orderedItem2 != null) {
			orderedItem2.setDeliveryDate(quotationDTO.getDeliveryDate());
		}
		HistoryQuotation historyQuotation = new HistoryQuotation();
		User user = userRepository.findById(idUser)
				.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		historyQuotation.setUser(user);
		historyQuotation.setQuotation(quotation);
		historyQuotation.setAction(TypeAction.UPDATE.name());
		StringBuilder contentHistoryQuotation = new StringBuilder();
		contentHistoryQuotation.append(MessageHistory.QUOTATION_CHANGE);

		int status = 0;
		if (!quotation.getQuotationStatus().getName().equals(quotationDTO.getQuotationStatus())) {
			quotation.setCreatedDate(LocalDateTime.now());
			contentHistoryQuotation.append(" Tình trạng:");
			contentHistoryQuotation.append(quotation.getQuotationStatus().getName());
			contentHistoryQuotation.append(" -> ");
			contentHistoryQuotation.append(quotationDTO.getQuotationStatus());
			// send mail
			utilsCommon.sendEmail(user.getUsername(), quotationDTO.getBoCode(), quotation.getQuotationStatus().getName(), quotationDTO.getQuotationStatus());
			//
			if (quotationDTO.getQuotationStatus().equalsIgnoreCase(QuotationStatusConstant.CONFIRM.name())) {
				status = 1;
				quotation.setRejectedItem(null);
				Optional<RejectedItem> rejectedItem = rejectedItemRepository.findByQuotationId(quotationDTO.getId());
				if (rejectedItem.isPresent()) {
					rejectedItemRepository.delete(rejectedItem.get());
				}
			} else if (quotationDTO.getQuotationStatus().equalsIgnoreCase(QuotationStatusConstant.REJECT.name())) {
				status = 2;
				quotation.setOrderedItem(null);
				Optional<OrderedItem> orderedItem = orderedItemRepository.findByQuotationId(quotationDTO.getId());
				if (orderedItem.isPresent()) {
					orderedItemRepository.deleteById(orderedItem.get().getId());
				}
			} else {
				status = 3;
				quotation.setRejectedItem(null);
				quotation.setOrderedItem(null);
				Optional<RejectedItem> rejectedItem = rejectedItemRepository.findByQuotationId(quotationDTO.getId());
				if (rejectedItem.isPresent()) {
					rejectedItemRepository.delete(rejectedItem.get());
				}
				Optional<OrderedItem> orderedItem = orderedItemRepository.findByQuotationId(quotationDTO.getId());
				if (orderedItem.isPresent()) {
					orderedItemRepository.deleteById(orderedItem.get().getId());
				}
			}
		} else {
			status = 0;
			// change reason
			if (quotationDTO.getQuotationStatus().equalsIgnoreCase(QuotationStatusConstant.REJECT.name())) {
				RejectedItem rejectedItem = rejectedItemRepository.findByQuotationId(quotation.getId())
						.orElseThrow(() -> new NotFoundException(MessageError.REJECTED_ITEM_NOT_FOUND));
				rejectedItem.setReason(quotationDTO.getReason());
				rejectedItemRepository.save(rejectedItem);
			}
		}
		boolean isChange = checkChangeValue(quotationDTO, quotation, contentHistoryQuotation);
		// status = 0: same item status, 1: confirm, 2: reject, 3: unknwon
		if (isChange || status != 0) {
			historyQuotation.setContent(contentHistoryQuotation.toString());
			historyQuotationRepository.save(historyQuotation);
		}
		LocalDateTime dateTime = quotation.getCreatedDate();
		BeanUtils.copyProperties(quotationDTO, quotation);
		quotation.setCreatedDate(dateTime);

		// set quotation status
		QuotationStatus quoStatus = quotationStatusRepository.findByName(quotationDTO.getQuotationStatus());
		quotation.setQuotationStatus(quoStatus);
		quotationRepository.save(quotation);
		if (status == 1) {
			createNewOrderedItem(quotationDTO, idUser, quotation, user, historyQuotation, true);
		} else if (status == 2) {
			createNewRejectedItem(quotationDTO, quotation, historyQuotation, true);
		}

		// delete
		logger.info("user id: {}  updated success quotation with id {}", idUser, quotation.getId());
		return quotationDTO;
	}

	private boolean checkChangeValue(QuotationDTO quotationDTO, Quotation quotation, StringBuilder contentChange) {
		// TODO Auto-generated method stub
		boolean flag = false;
		
		if (!quotationDTO.getName().equals(quotation.getName())) {
			contentChange.append(" Tên:");
			contentChange.append(quotation.getName());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getName());
			flag = true;
		}
		if (!quotationDTO.getBoCode().equals(quotation.getBoCode())) {
			contentChange.append(" Mã BO:");
			contentChange.append(quotation.getBoCode());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getBoCode());
			flag = true;
		}
		if (!quotationDTO.getNameOfCustomer().equals(quotation.getNameOfCustomer())) {
			contentChange.append(" .Tên khách:");
			contentChange.append(quotation.getNameOfCustomer());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getNameOfCustomer());
			flag = true;
		}
		if (!quotationDTO.getPrice().equals(quotation.getPrice())) {
			contentChange.append(" .Giá:");
			contentChange.append(quotation.getPrice());
			contentChange.append(" -> ");
			contentChange.append(quotationDTO.getPrice());
			flag = true;
		}
		if (quotationDTO.getQuantity() != quotation.getQuantity()) {
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
		HistoryQuotation historyQuotation = new HistoryQuotation();
		User user = userRepository.findById(idUser)
				.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		historyQuotation.setUser(user);
		historyQuotation.setQuotation(quotation);
		historyQuotation.setAction(TypeAction.UPDATE.name());
		historyQuotation.setContent("đã xóa order này");
		historyQuotationRepository.save(historyQuotation);
		quotationRepository.save(quotation);
		logger.info("user id: {} had change status quotation to delete with id {}", idUser, id);
	}

	@Override
	public void delete(Long id, Long idUser) {
		// TODO Auto-generated method stub
		Quotation quotation = quotationRepository.findById(id)
				.orElseThrow(() -> new NotFoundException(MessageError.QUOTATION_NOT_FOUND));
		quotationRepository.delete(quotation);
		logger.info("user id: {} had  delete quotation with id {}", idUser, id);
	}

	@Override
	public Page<QuotationDTO> find(String nameOfCustomer, Pageable pageable, boolean isDeleted, String qstatus, String orderStatus) {
		// TODO Auto-generated method stub
		nameOfCustomer = UtilsCommon.concatString("%", nameOfCustomer, "%");
		Page<Quotation> pageQuotations = quotationRepository
				.findByNameOfCustomerLikeAndIsDeletedIsAndQuotationStatusNameLike(nameOfCustomer, pageable, isDeleted,
						qstatus);
		List<QuotationDTO> quotationDTOs = new ArrayList<QuotationDTO>();
		pageQuotations.getContent().forEach(quotation -> {
			if(orderStatus.equals("") || quotation.getOrderedItem().getStatus().getName().equals(orderStatus)) {
				QuotationDTO quotationDTO = new QuotationDTO();
				BeanUtils.copyProperties(quotation, quotationDTO);
				quotationDTO.setQuotationStatus(quotation.getQuotationStatus().getName());
				if (quotation.getQuotationStatus().getName().equals(QuotationStatusConstant.REJECT.name())) {
					RejectedItem rejectedItem = rejectedItemRepository.findByQuotationId(quotation.getId())
							.orElseThrow(() -> new NotFoundException(MessageError.QUOTATION_NOT_FOUND));
					quotationDTO.setReason(rejectedItem.getReason());
				}
				if (quotation.getOrderedItem() != null) {
					quotationDTO.setStatusOrder(quotation.getOrderedItem().getStatus().getName());
					quotationDTO.setDeliveryDate(quotation.getOrderedItem().getDeliveryDate());
					quotationDTO.setRealDeliveryDate(quotation.getOrderedItem().getRealDeliveryDate());
				}
				quotationDTOs.add(quotationDTO);
			}
		});
		return new PageImpl<QuotationDTO>(quotationDTOs, pageable, pageQuotations.getTotalElements());
	}

}
