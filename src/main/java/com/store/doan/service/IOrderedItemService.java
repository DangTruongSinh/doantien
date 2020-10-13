package com.store.doan.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.store.doan.constant.OrderStatusConstant;
import com.store.doan.dto.OrderedItemDTO;
import com.store.doan.dto.QuotationDTO;

public interface IOrderedItemService {
	
	 Page<QuotationDTO> findBySearch(Long userId, Pageable pageable);
	
	 void deleteByNotAdmin(Long userId, Long idItem);
	 
	 void delete(Long userId, Long idItem);
	 
	 OrderedItemDTO update(Long userId, OrderedItemDTO orderedItemDTO);
	 
	 void updateStatusOrderedItem(Long userId, Long idItem, OrderStatusConstant orderStatusConstant);
	 
	 OrderedItemDTO viewDetail(Long userId, Long idItem);
}
