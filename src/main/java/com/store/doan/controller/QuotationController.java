package com.store.doan.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.doan.dto.QuotationDTO;
import com.store.doan.service.IQuotationService;

@RestController
public class QuotationController {
	
	Long idUser = 1L;
	
	@Autowired
	IQuotationService iQuotationService;
	
	@PostMapping("/quotations")
	public QuotationDTO createNew(@RequestBody @Valid QuotationDTO quotationDTO) {
		return iQuotationService.createNew(quotationDTO, idUser);
	}
	
	@DeleteMapping("/quotations/{id}")
	public void deleteNotByAdmin(@PathVariable Long id) {
		iQuotationService.deleteNotByAdmin(id, idUser);
	}
	
	@DeleteMapping("/quotations/admin/{id}")
	public void delete(@PathVariable Long id) {
		iQuotationService.delete(id, idUser);
	}
	
	@GetMapping("/quotations")
	public Page<QuotationDTO> paging(@RequestParam(name = "name",required = false,defaultValue = "") String name, Pageable pageable){
		return iQuotationService.find(name, pageable);
	}
	
	@PutMapping("/quotations")
	public QuotationDTO update(@RequestBody QuotationDTO quotationDTO) {
		return iQuotationService.update(quotationDTO, idUser);
	}
}
