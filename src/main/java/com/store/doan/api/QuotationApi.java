package com.store.doan.api;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.doan.constant.QuotationStatusConstant;
import com.store.doan.dto.HistoryDTO;
import com.store.doan.dto.QuotationDTO;
import com.store.doan.security.service.UserDetailsImpl;
import com.store.doan.service.IHistoryQuotationsService;
import com.store.doan.service.IQuotationService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class QuotationApi {
	
	
	@Autowired
	IQuotationService iQuotationService;
	
	@Autowired
	IHistoryQuotationsService iHistoryQuotationsService;
	
	static final Logger logger = LoggerFactory.getLogger(QuotationApi.class);
	
	@GetMapping("/quotations/checkExistBBG/{bbg}")
	public String checkExist(@PathVariable String bbg){
		return iQuotationService.checkExistBBG(bbg);
	}
	
	@GetMapping("/quotations/histories/{id}")
	public List<HistoryDTO> findHistory(@PathVariable Long id){
		return iHistoryQuotationsService.getAll(id);
	}
	
	@PostMapping("/quotations")
	public QuotationDTO createNew(@RequestBody QuotationDTO quotationDTO) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(quotationDTO.getDeliveryDate() != null) {
			String deliveryDate[] = quotationDTO.getDeliveryDate().split("/");
			quotationDTO.setDeliveryDate(String.format("%s/%s/%s", deliveryDate[1], deliveryDate[0], deliveryDate[2]));
		}
		
		return iQuotationService.createNew(quotationDTO, userDetails.getId());
	}
	
	@DeleteMapping("/quotations/{id}")
	public void deleteNotByAdmin(@PathVariable Long id) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		iQuotationService.deleteNotByAdmin(id, userDetails.getId());
	}
	
	@DeleteMapping("/quotations/admin/{id}")
	public void delete(@PathVariable Long id) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		iQuotationService.delete(id, userDetails.getId());
	}
	
	@GetMapping(value = "/quotations")
	public Page<QuotationDTO> paging(@RequestParam(name = "name",required = false,defaultValue = "") String name,
			@RequestParam(required = false, defaultValue = "0", name = "page") Integer page, @RequestParam(required = false, defaultValue = "5", name = "size") Integer size,
			@RequestParam(required = false, defaultValue = "false", name = "isDelete") Boolean isDelete,
			@RequestParam(required = false, defaultValue = "UNKNOWN", name = "quoStatus") QuotationStatusConstant quoStatus,
			@RequestParam(required = false, name = "orderStatus", defaultValue = "") String orderStatus){
		logger.info("orderStatus {}", orderStatus);
		Sort sort = Sort.by("createdDate").descending();
		Pageable pageable = PageRequest.of(page, size, sort);
		return iQuotationService.find(name, pageable, isDelete, quoStatus.name(), orderStatus);
	}
	
	@PutMapping("/quotations")
	public QuotationDTO update(@RequestBody QuotationDTO quotationDTO) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(quotationDTO.getDeliveryDate() != null) {
			String deliveryDate[] = quotationDTO.getDeliveryDate().split("/");
			quotationDTO.setDeliveryDate(String.format("%s/%s/%s", deliveryDate[1], deliveryDate[0], deliveryDate[2]));
		}
		return iQuotationService.update(quotationDTO, userDetails.getId());
	}
}
