package com.store.doan.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.store.doan.constant.MessageError;
import com.store.doan.constant.MessageHistory;
import com.store.doan.constant.OrderStatusConstant;
import com.store.doan.constant.QuotationStatusConstant;
import com.store.doan.constant.TypeAction;
import com.store.doan.dto.HistoryDTO;
import com.store.doan.dto.OrderStatusDTO;
import com.store.doan.dto.OrderedItemDTO;
import com.store.doan.exception.DocumentStorageException;
import com.store.doan.exception.NotFoundException;
import com.store.doan.model.HistoryQuotation;
import com.store.doan.model.OrderStatus;
import com.store.doan.model.OrderedItem;
import com.store.doan.model.Quotation;
import com.store.doan.model.User;
import com.store.doan.model.UserNotification;
import com.store.doan.repository.HistoryQuotationRepository;
import com.store.doan.repository.OrderStatusRepository;
import com.store.doan.repository.OrderedItemRepository;
import com.store.doan.repository.QuotationRepository;
import com.store.doan.repository.UserNotificationRepository;
import com.store.doan.repository.UserRepository;
import com.store.doan.service.INotificationService;
import com.store.doan.service.IOrderedItemService;
import com.store.doan.utils.UtilsCommon;

@Service
public class OrderedItemServiceImpl implements IOrderedItemService {

	@Autowired
	OrderedItemRepository orderedItemRepository;

	@Autowired
	OrderStatusRepository orderStatusRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	HistoryQuotationRepository historyQuotationRepository;

	@Autowired
	INotificationService iNotificationService;

	@Autowired
	UserNotificationRepository userNotificationRepository;

	@Autowired
	QuotationRepository quotationRepository;

	@Value("${file.upload-dir}")
	String filePath;

	@Autowired
	UtilsCommon utilsCommon;

	Logger logger = LoggerFactory.getLogger(OrderedItemServiceImpl.class);

	private Path fileStorageLocation = null;

	public OrderedItemServiceImpl() throws DocumentStorageException {
		super();
		this.fileStorageLocation = Paths.get("/home/yogesh/media/upload").toAbsolutePath().normalize();
		try {
			Files.createDirectories(this.fileStorageLocation);
		} catch (Exception ex) {
			throw new DocumentStorageException(
					"Could not create the directory where the uploaded files will be stored.", ex);
		}
	}

	@Override
	public Page<OrderedItemDTO> findBySearch(Pageable pageable, String boCode, Long idUser) {
		// TODO Auto-generated method stub
		boCode = "%" + boCode + "%";
		Page<Quotation> pageQuotations = quotationRepository.findByBoCodeLikeAndIsDeletedIsAndQuotationStatusNameLike(
				boCode, pageable, false, QuotationStatusConstant.CONFIRM.name());
		List<OrderedItemDTO> orderedItemDTOs = new ArrayList<OrderedItemDTO>();
		Set<Long> idOrders = new HashSet<Long>();
		pageQuotations.getContent().forEach(quo -> {
			idOrders.add(quo.getOrderedItem().getId());
			if (!quo.isDeleted()) {
				if (quo.getOrderedItem().getStatus().getName().equals(OrderStatusConstant.WaitProcess.getValue())
						|| quo.getOrderedItem().getStatus().getName().equals(OrderStatusConstant.Processing.getValue())
						|| quo.getOrderedItem().getStatus().getName()
								.equals(OrderStatusConstant.FishedProcess.getValue())) {
					OrderedItemDTO orderedItemDTO = new OrderedItemDTO();
					orderedItemDTO.setId(quo.getOrderedItem().getId());
					orderedItemDTO.setBoCode(quo.getBoCode());
					orderedItemDTO.setQuantity(quo.getQuantity());
					orderedItemDTO.setSpecifications(quo.getOrderedItem().getSpecifications());
					orderedItemDTO.setCaculateUnit(quo.getOrderedItem().getCaculateUnit());
					orderedItemDTO.setStatus(quo.getOrderedItem().getStatus().getName());
					orderedItemDTO.setName(quo.getName());
					if (quo.getOrderedItem().getNote() != null) {
						orderedItemDTO.setNote(quo.getOrderedItem().getNote());
					}
					if (quo.getOrderedItem().getFilePathDrawing() != null) {
						orderedItemDTO.setFilePathDrawing(filePath + "/" + quo.getOrderedItem().getFilePathDrawing());
					}
					orderedItemDTOs.add(orderedItemDTO);
				}
			}
		});
		// update status
		for(Long idOrder : idOrders) {
				List<UserNotification> userNotifications = userNotificationRepository
						.findByOrderedItemIdAndUserId(idOrder, idUser);
				if (userNotifications != null) {
					userNotifications.forEach(userNotification -> {
						userNotification.setViewed(true);
						userNotificationRepository.save(userNotification);
					});
				}
		}
		return new PageImpl<OrderedItemDTO>(orderedItemDTOs, pageable, pageQuotations.getTotalElements());
	}

	@Override
	public OrderedItemDTO update(Long userId, OrderedItemDTO orderedItemDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void updateStatusOrderedItem(Long userId, OrderStatusDTO orderedItemStatusDTO) {
		// TODO Auto-generated method stub
		OrderedItem orderedItem = orderedItemRepository.findById(orderedItemStatusDTO.getId())
				.orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
		OrderStatus orderStatus = orderStatusRepository.findByName(orderedItemStatusDTO.getName());
		// quotation histories
		StringBuilder contentHistory = new StringBuilder();
		contentHistory.append(MessageHistory.QUOTATION_CHANGE);
		contentHistory.append("Status: ");
		contentHistory.append(orderedItem.getStatus().getName());
		contentHistory.append("-> ");
		contentHistory.append(orderedItemStatusDTO.getName());
		HistoryQuotation historyQuotation = new HistoryQuotation();
		historyQuotation.setAction(TypeAction.UPDATE.name());
		historyQuotation.setContent(contentHistory.toString());
		historyQuotation.setDateTime(LocalDateTime.now());
		historyQuotation.setQuotation(orderedItem.getQuotation());
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		historyQuotation.setUser(user);
		historyQuotationRepository.save(historyQuotation);
		//
		orderedItem.setStatus(orderStatus);
		orderedItemRepository.save(orderedItem);

		// create notification
		logger.info("user id {} update status of item id {} !", userId, orderedItemStatusDTO.getId());
		iNotificationService.createNotification(orderedItemStatusDTO.getId(), orderedItemStatusDTO.getName());
		// send mail
		utilsCommon.sendEmail(user.getUsername(), orderedItem.getQuotation().getBoCode(),
				orderedItem.getStatus().getName(), orderedItemStatusDTO.getName());
	}

	@Override
	public OrderedItemDTO viewDetail(Long idItem) {

		OrderedItemDTO orderedItemDTO = view(idItem, 0l, 0l);
		return orderedItemDTO;
	}

	private OrderedItemDTO view(Long idItem, Long idOrderedItem, Long idUser) {
		OrderedItem orderedItem = orderedItemRepository.findByQuotationId(idItem)
				.orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
		if (idOrderedItem != null && idUser != null && idUser > 0) {
			List<UserNotification> userNotifications = userNotificationRepository
					.findByOrderedItemIdAndUserId(orderedItem.getId(), idUser);
			if (userNotifications != null) {
				userNotifications.forEach(userNotification -> {
					userNotification.setViewed(true);
					userNotificationRepository.save(userNotification);
				});
			}
		}

		OrderedItemDTO orderedItemDTO = new OrderedItemDTO();
		// map data form entity to dto
		orderedItemDTO.setAddress(orderedItem.getAddress());
		orderedItemDTO.setBoCode(orderedItem.getQuotation().getBoCode());
		orderedItemDTO.setCaculateUnit(orderedItem.getCaculateUnit());
		orderedItemDTO.setDeliveryDate(orderedItem.getDeliveryDate());
		orderedItemDTO.setFilePathDrawing(orderedItem.getFilePathDrawing());
		orderedItemDTO.setId(orderedItem.getId());
		orderedItemDTO.setNote(orderedItem.getNote());
		orderedItemDTO.setOrderDate(orderedItem.getOrderDate());
		orderedItemDTO.setProcessDate(orderedItem.getProcessDate());
		orderedItemDTO.setEmail(orderedItem.getQuotation().getEmail());
		orderedItemDTO.setNameOfCustomer(orderedItem.getQuotation().getNameOfCustomer());
		orderedItemDTO.setPhoneNumber(orderedItem.getQuotation().getPhoneNumber());
		orderedItemDTO.setPrice(orderedItem.getQuotation().getPrice());
		orderedItemDTO.setQuantity(orderedItem.getQuotation().getQuantity());
		orderedItemDTO.setStatus(orderedItem.getStatus().getName());
		orderedItemDTO.setSpecifications(orderedItem.getSpecifications());
		orderedItemDTO.setName(orderedItem.getQuotation().getName());
		orderedItemDTO.setRealDeliveryDate(orderedItem.getRealDeliveryDate());
		// map histories
		List<HistoryDTO> orderedItemHistoris = new ArrayList<HistoryDTO>();
		List<HistoryQuotation> historyQuotations = historyQuotationRepository
				.findByQuotationId(orderedItem.getQuotation().getId());
		historyQuotations.forEach(history -> {
			HistoryDTO historyDTO = new HistoryDTO();
			historyDTO.setContent(history.getContent());
			historyDTO.setNameUser(history.getUser().getUsername());
			historyDTO.setDateTime(history.getDateTime());
			historyDTO.setAction(history.getAction());
			orderedItemHistoris.add(historyDTO);
		});
		orderedItemDTO.setOrderedItemHistories(orderedItemHistoris);
		return orderedItemDTO;
	}

	@Override
	public List<OrderStatusDTO> findAllStatus() {
		// TODO Auto-generated method stub
		List<OrderStatus> orderStatus = orderStatusRepository.findAll();
		List<OrderStatusDTO> result = new ArrayList<OrderStatusDTO>();
		orderStatus.forEach(x -> {
			OrderStatusDTO status = new OrderStatusDTO();
			status.setName(x.getName());
			result.add(status);
		});
		return result;
	}

	@Override
	public OrderedItemDTO update(OrderedItemDTO orderDTO, MultipartFile file, Long idUser) {
		// TODO Auto-generated method stub
		OrderedItem orderedItem = orderedItemRepository.findByQuotationId(orderDTO.getIdQuotation())
				.orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
		User user = userRepository.findById(idUser).get();
		// save history
		boolean flag = false;
		StringBuilder bodyChange = new StringBuilder();
		if(orderedItem.getSpecifications() != null && "null".equals(orderedItem.getSpecifications())) {
			orderedItem.setSpecifications(null);
		}
		if(orderedItem.getCaculateUnit() != null && "null".equals(orderedItem.getCaculateUnit())) {
			orderedItem.setCaculateUnit(null);
		}
		if (orderedItem.getDeliveryDate() != null
				&& !orderedItem.getDeliveryDate().equals(orderDTO.getDeliveryDate())) {
			bodyChange.append(". Ngày giao hàng: ");
			bodyChange.append(orderedItem.getDeliveryDate());
			bodyChange.append("->");
			bodyChange.append(orderDTO.getDeliveryDate());
			flag = true;
		}
		if (orderedItem.getQuotation().getName() != null
				&& !orderedItem.getQuotation().getName().equals(orderDTO.getName())) {
			bodyChange.append(". Tên: ");
			bodyChange.append(orderedItem.getQuotation().getName());
			bodyChange.append("->");
			bodyChange.append(orderDTO.getName());
			flag = true;
		}
		if (orderedItem.getAddress() != null && !orderedItem.getAddress().equals(orderDTO.getAddress())) {
			bodyChange.append(". địa chỉ: ");
			bodyChange.append(orderedItem.getAddress());
			bodyChange.append("->");
			bodyChange.append(orderDTO.getAddress());
			flag = true;
		}
		if (orderedItem.getCaculateUnit() != null
				&& !orderedItem.getCaculateUnit().equals(orderDTO.getCaculateUnit())) {
			bodyChange.append(". đơn vị tính: ");
			bodyChange.append(orderedItem.getCaculateUnit());
			bodyChange.append("->");
			bodyChange.append(orderDTO.getCaculateUnit());
			flag = true;
		}
		if (file != null) {
			String nameFile = orderedItem.getId() + "_" + file.getOriginalFilename();
			if (orderedItem.getFilePathDrawing() != null && !nameFile.equals(orderedItem.getFilePathDrawing())) {
				bodyChange.append(". tên file: ");
				bodyChange.append(orderedItem.getFilePathDrawing());
				bodyChange.append("->");
				bodyChange.append(file.getOriginalFilename());
				flag = true;
			}
		}
		if ((orderedItem.getNote() != null && orderDTO.getNote() != null)) {
			if(orderedItem.getNote().equals(orderDTO.getNote())) {
				bodyChange.append(". ghi chú: ");
				bodyChange.append(orderedItem.getNote());
				bodyChange.append("->");
				bodyChange.append(orderDTO.getNote());
				flag = true;
			}
		}
		if (orderedItem.getStatus() != null && !orderedItem.getStatus().getName().equals(orderDTO.getStatus())) {
			bodyChange.append(". tình trạng: ");
			bodyChange.append(orderedItem.getStatus().getName());
			bodyChange.append("->");
			bodyChange.append(orderDTO.getStatus());
			flag = true;
			if(orderDTO.getStatus().equals(OrderStatusConstant.WaitShip.getValue())) {
				orderedItem.setRealDeliveryDate(LocalDateTime.now());
			}
			iNotificationService.createNotification(orderedItem.getId(), orderDTO.getStatus());
			user = userRepository.findById(idUser)
					.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
			// send mail
			utilsCommon.sendEmail(user.getUsername(), orderedItem.getQuotation().getBoCode(),
					orderedItem.getStatus().getName(), orderDTO.getStatus());
		}
		if (orderedItem.getSpecifications() != null
				&& !orderedItem.getSpecifications().equals(orderDTO.getSpecifications())) {
			bodyChange.append(". Thông số kỹ thuật: ");
			bodyChange.append(orderedItem.getSpecifications());
			bodyChange.append("->");
			bodyChange.append(orderDTO.getSpecifications());
			flag = true;
		}
		if (orderDTO.getBoCode() != null && !orderDTO.getBoCode().equals(orderedItem.getQuotation().getBoCode())) {
			bodyChange.append(" Mã BO:");
			bodyChange.append(orderedItem.getQuotation().getBoCode());
			bodyChange.append(" -> ");
			bodyChange.append(orderDTO.getBoCode());
			flag = true;
		}
		if (orderDTO.getEmail() != null && !orderDTO.getEmail().equals(orderedItem.getQuotation().getEmail())) {
			bodyChange.append(" .Email:");
			bodyChange.append(orderedItem.getQuotation().getEmail());
			bodyChange.append(" -> ");
			bodyChange.append(orderDTO.getEmail());
			flag = true;
		}
		if (orderDTO.getNameOfCustomer() != null
				&& !orderDTO.getNameOfCustomer().equals(orderedItem.getQuotation().getNameOfCustomer())) {
			bodyChange.append(" .Tên khách:");
			bodyChange.append(orderedItem.getQuotation().getNameOfCustomer());
			bodyChange.append(" -> ");
			bodyChange.append(orderDTO.getNameOfCustomer());
			flag = true;
		}
		if (orderDTO.getPhoneNumber() != null
				&& !orderDTO.getPhoneNumber().equals(orderedItem.getQuotation().getPhoneNumber())) {
			bodyChange.append(" .Số điện thoại:");
			bodyChange.append(orderedItem.getQuotation().getPhoneNumber());
			bodyChange.append(" -> ");
			bodyChange.append(orderDTO.getPhoneNumber());
			flag = true;
		}
		if (orderDTO.getPrice() != null && !orderDTO.getPrice().equals(orderedItem.getQuotation().getPrice())) {
			bodyChange.append(" .Giá:");
			bodyChange.append(orderedItem.getQuotation().getPrice());
			bodyChange.append(" -> ");
			bodyChange.append(orderDTO.getPrice());
			flag = true;
		}
		if (orderDTO.getQuantity() != orderedItem.getQuotation().getQuantity()) {
			bodyChange.append(" .Số lượng:");
			bodyChange.append(orderedItem.getQuotation().getQuantity());
			bodyChange.append(" -> ");
			bodyChange.append(orderDTO.getQuantity());
			flag = true;
		}

		//
		OrderStatus status = orderStatusRepository.findByName(orderDTO.getStatus());
		if (!orderDTO.getStatus().equals(orderedItem.getStatus().getName())) {
			if (orderDTO.getStatus().equals(OrderStatusConstant.Processing.getValue())) {
				orderedItem.setProcessDate(LocalDateTime.now());
			} else if (orderDTO.getStatus().equals(OrderStatusConstant.WaitShip.getValue())) {
				orderedItem.setRealDeliveryDate(LocalDateTime.now());
			}
		}
		orderedItem.setStatus(status);
		orderedItem.getQuotation().setNameOfCustomer(orderDTO.getNameOfCustomer());
		orderedItem.getQuotation().setPhoneNumber(orderDTO.getPhoneNumber());
		orderedItem.getQuotation().setEmail(orderDTO.getEmail());
		orderedItem.setAddress(orderDTO.getAddress());
		orderedItem.getQuotation().setBoCode(orderDTO.getBoCode());
		orderedItem.setSpecifications(orderDTO.getSpecifications());
		orderedItem.setCaculateUnit(orderDTO.getCaculateUnit());
		orderedItem.getQuotation().setQuantity(orderDTO.getQuantity());
		orderedItem.getQuotation().setPrice(orderDTO.getPrice());
		orderedItem.setNote(orderDTO.getNote());
		orderedItem.setDeliveryDate(orderDTO.getDeliveryDate());
		// check change value to save history

		// asve file
		// Normalize file name
		if (file != null) {
			String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
			String fileName = "";
			try {
				// Check if the file's name contains invalid characters
				if (originalFileName.contains("..")) {
					throw new DocumentStorageException(
							"Sorry! Filename contains invalid path sequence " + originalFileName);
				}
				fileName = orderedItem.getId() + "_" + originalFileName;
				// Copy file to the target location (Replacing existing file with the same name)
				Path targetLocation = this.fileStorageLocation.resolve(fileName);
				Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
				String fileNameOld = orderedItem.getFilePathDrawing();
				if (fileNameOld == null || !fileNameOld.equals(fileName)) {
					orderedItem.setFilePathDrawing(fileName);
				}
				orderedItemRepository.save(orderedItem);
				orderDTO.setId(orderedItem.getId());
				orderDTO.setFilePathDrawing(fileName);

			} catch (IOException ex) {
				throw new DocumentStorageException("Could not store file " + fileName + ". Please try again!", ex);
			}
		}
		// save history
		StringBuilder contentHistory = new StringBuilder();
		if (flag) {
			contentHistory.append(MessageHistory.QUOTATION_CHANGE);
			contentHistory.append(bodyChange.toString());
			HistoryQuotation historyQuotation = new HistoryQuotation();
			historyQuotation.setAction(TypeAction.UPDATE.name());
			historyQuotation.setContent(contentHistory.toString());
			historyQuotation.setDateTime(LocalDateTime.now());
			historyQuotation.setQuotation(orderedItem.getQuotation());
			historyQuotation.setUser(user);
			historyQuotationRepository.save(historyQuotation);

		}

		return orderDTO;
	}

	public Resource loadFileAsResource(String fileName) throws Exception {
		try {
			Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());
			if (resource.exists()) {
				return resource;
			} else {
				throw new FileNotFoundException("File not found " + fileName);
			}
		} catch (MalformedURLException ex) {
			throw new FileNotFoundException("File not found " + fileName);
		}
	}

	@Override
	public OrderedItemDTO viewDetailAndChangeStatusNotification(Long idItem, Long idOrderedItem, Long idUser) {
		OrderedItemDTO orderedItemDTO = view(idItem, idOrderedItem, idUser);
		return orderedItemDTO;
	}

}
