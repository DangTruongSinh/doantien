package com.store.doan.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.store.doan.dto.SuppliesDTO;
import com.store.doan.dto.SuppliesDetailDTO;

public interface ISuppliesService {
	
	public SuppliesDTO create(SuppliesDTO suppliesDTO, Long idUser);
	
	public SuppliesDTO update(SuppliesDTO suppliesDTO, Long idUser);
	
	public void deleteNotAdmin(Long id, Long idUser);
	
	public void delete(Long id, Long idUser);
	
	public SuppliesDetailDTO viewDetail(Long id);
	
	Page<SuppliesDTO> findProvider(String provider, Pageable pageable);
}
