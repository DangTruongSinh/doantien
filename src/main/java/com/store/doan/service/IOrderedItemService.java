package com.store.doan.service;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.store.doan.dto.OrderStatusDTO;
import com.store.doan.dto.OrderedItemDTO;

public interface IOrderedItemService {
	
	 Page<OrderedItemDTO> findBySearch(Pageable pageable, String boCode, Long idUser, String type);
	
	 
	 
	 OrderedItemDTO update(Long userId, OrderedItemDTO orderedItemDTO);
	 
	 void updateStatusOrderedItem(Long userId, OrderStatusDTO orderedItemDTO);
	 
	 OrderedItemDTO viewDetail(Long idItem);
	 
	 OrderedItemDTO viewDetailAndChangeStatusNotification(Long idItem, Long idNotification, Long idUser);

	 List<OrderStatusDTO> findAllStatus();
	 
	 OrderedItemDTO update(OrderedItemDTO orderDTO, MultipartFile multipartFile, Long idUser, String dateSubmit);
	 
	 Resource loadFileAsResource(String fileName) throws Exception;
	 
}
