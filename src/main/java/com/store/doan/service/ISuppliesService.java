package com.store.doan.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.store.doan.dto.SuppliesDTO;

public interface ISuppliesService {
	
	public SuppliesDTO create(SuppliesDTO suppliesDTO, Long idUser);
	
	public SuppliesDTO update(SuppliesDTO suppliesDTO, Long idUser);
	
	public void deleteNotAdmin(Long id, Long idUser);
	
	public void delete(Long id, Long idUser);
	
	Page<SuppliesDTO> findProvider(String provider, Pageable pageable, boolean isDelete);
}
