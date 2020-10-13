package com.store.doan.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.store.doan.constant.MessageError;
import com.store.doan.constant.MessageHistory;
import com.store.doan.constant.OrderStatusConstant;
import com.store.doan.dto.HistoryDTO;
import com.store.doan.dto.OrderedItemDTO;
import com.store.doan.dto.QuotationDTO;
import com.store.doan.exception.NotFoundException;
import com.store.doan.model.HistoryOrders;
import com.store.doan.model.OrderStatus;
import com.store.doan.model.OrderedItem;
import com.store.doan.model.User;
import com.store.doan.repository.HistoryOrderRepository;
import com.store.doan.repository.OrderStatusRepository;
import com.store.doan.repository.OrderedItemRepository;
import com.store.doan.repository.UserRepository;
import com.store.doan.service.IOrderedItemService;

@Service
public class OrderedItemServiceImpl implements IOrderedItemService {

	@Autowired
	OrderedItemRepository orderedItemRepository;

	@Autowired
	OrderStatusRepository orderStatusRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	HistoryOrderRepository historyOrderRepository;

	Logger logger = LoggerFactory.getLogger(OrderedItemServiceImpl.class);

	@Override
	public Page<QuotationDTO> findBySearch(Long userId, Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteByNotAdmin(Long userId, Long idItem) {
		// TODO Auto-generated method stub
		OrderedItem orderedItem = orderedItemRepository.findById(idItem)
				.orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		orderedItem.setDelete(true);
		saveHistory(user, orderedItem, null);
		orderedItemRepository.save(orderedItem);
		logger.info("user id {} update delete field state of item id {} to invisible!", userId, idItem);
	}

	private void saveHistory(User user, OrderedItem orderedItem, OrderedItemDTO orderedItemDTO) {
		StringBuilder builder = new StringBuilder();
		builder.append(MessageHistory.ORDERED_ITEM_UPDATED);
		// case delete
		if (orderedItemDTO == null) {
			builder.append(". Được xóa bởi useraccount ");
			builder.append(user.getUsername());
		} else {
			if(!orderedItem.getAddress().equals(orderedItemDTO.getAddress())) {
				builder.append(". Địa chỉ: ");
				builder.append(orderedItem.getAddress());
				builder.append(" -> ");
				builder.append(orderedItemDTO.getAddress());
			} else if(!orderedItem.getCaculateUnit().equals(orderedItemDTO.getCaculateUnit())) {
				builder.append(". Đơn vị tính: ");
				builder.append(orderedItem.getCaculateUnit());
				builder.append(" -> ");
				builder.append(orderedItemDTO.getCaculateUnit());
			} else if(!orderedItem.getDeliveryDate().toString().equals(orderedItemDTO.getDeliveryDate().toString())) {
				builder.append(". Ngày giao hàng: ");
				builder.append(orderedItem.getDeliveryDate());
				builder.append(" -> ");
				builder.append(orderedItemDTO.getDeliveryDate());
			} else if(!orderedItem.getNote().equals(orderedItemDTO.getNote())) {
				builder.append(". Chú thích: ");
				builder.append(orderedItem.getNote());
				builder.append(" -> ");
				builder.append(orderedItemDTO.getNote());
			} else if(!orderedItem.getOrderDate().toString().equals(orderedItemDTO.getOrderDate().toString())) {
				builder.append(". Ngày đặt: ");
				builder.append(orderedItem.getNote());
				builder.append(" -> ");
				builder.append(orderedItemDTO.getNote());
			} else if(!orderedItem.getStatus().getName().equals(orderedItemDTO.getStatus().getName())) {
				// create notification
				
			} else if(!orderedItem.getSpecifications().equals(orderedItemDTO.getSpecifications())) {
				builder.append(". Thông số kỹ thuật: ");
				builder.append(orderedItem.getSpecifications());
				builder.append(" -> ");
				builder.append(orderedItemDTO.getSpecifications());
			}
		}
		HistoryOrders historyOrders = new HistoryOrders();
		historyOrders.getHistoryQuotation().setContent(builder.toString());
		historyOrders.setOrderedItem(orderedItem);
		historyOrders.getHistoryQuotation().setUser(user);
		historyOrderRepository.save(historyOrders);
	}

	@Override
	public void delete(Long userId, Long idItem) {
		// TODO Auto-generated method stub
		OrderedItem orderedItem = orderedItemRepository.findById(idItem)
				.orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
		orderedItemRepository.delete(orderedItem);
		logger.info("user id {} deleted field state of item id {} !", userId, idItem);
	}

	@Override
	public OrderedItemDTO update(Long userId, OrderedItemDTO orderedItemDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void updateStatusOrderedItem(Long userId, Long idItem, OrderStatusConstant orderStatusConstant) {
		// TODO Auto-generated method stub
		OrderedItem orderedItem = orderedItemRepository.findById(idItem)
				.orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
		OrderStatus orderStatus = orderStatusRepository.findByName(orderStatusConstant.name());
		orderedItem.setStatus(orderStatus);
		orderedItemRepository.save(orderedItem);
		
		// create notification
		logger.info("user id {} update status of item id {} !", userId, idItem);
	}

	@Override
	public OrderedItemDTO viewDetail(Long userId, Long idItem) {
		OrderedItem orderedItem = orderedItemRepository.findById(idItem)
				.orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
		OrderedItemDTO orderedItemDTO = new OrderedItemDTO();
		BeanUtils.copyProperties(orderedItem, orderedItemDTO);
		List<HistoryDTO> orderedItemHistoris = new ArrayList<HistoryDTO>();
		orderedItem.getHistoryOrders().forEach(history -> {
			HistoryDTO historyDTO = new HistoryDTO();
			historyDTO.setContent(history.getHistoryQuotation().getContent());
			historyDTO.setNameUser(history.getHistoryQuotation().getUser().getUsername());
			historyDTO.setDate(history.getHistoryQuotation().getDateTime().toLocalDate());
			historyDTO.setTime(history.getHistoryQuotation().getDateTime().toLocalTime());
			orderedItemHistoris.add(historyDTO);
		});
		orderedItemDTO.setOrderedItemHistories(orderedItemHistoris);
		return orderedItemDTO;
	}
}
