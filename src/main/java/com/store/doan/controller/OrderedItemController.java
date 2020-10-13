package com.store.doan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RestController;

import com.store.doan.dto.QuotationDTO;
import com.store.doan.service.IOrderedItemService;

@RestController
public class OrderedItemController {
	
	Long userId = 1l;
	
	@Autowired
	IOrderedItemService iOrderedItemService;
	public Page<QuotationDTO> paging(Pageable pageable){
		return iOrderedItemService.findBySearch(userId, pageable);
	}
}
