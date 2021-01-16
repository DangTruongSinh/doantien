package com.store.doan.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.store.doan.dto.QuotationDTO;

public interface IQuotationService {
	
	public QuotationDTO createNew(QuotationDTO quotationDTO, Long idUser);
	
	public QuotationDTO update(QuotationDTO quotationDTO, Long idUser);
	
	public void deleteNotByAdmin(Long id, Long idUser);
	
	public void delete(Long id, Long idUser);
	
	Page<QuotationDTO> find(String provider, Pageable pageable, boolean isDeleted, String qstatus, String orderStatus);
	
	public String checkExistBBG(String bbg);
}
