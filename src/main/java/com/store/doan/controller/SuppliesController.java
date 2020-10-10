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

import com.store.doan.dto.SuppliesDTO;
import com.store.doan.dto.SuppliesDetailDTO;
import com.store.doan.service.ISuppliesService;

@RestController
public class SuppliesController {
	
	@Autowired
	ISuppliesService iSuppliesService;
	
	Long idUser = 1l;
	
	@GetMapping("/supplies/{id}")
	public SuppliesDetailDTO viewDetail(@PathVariable Long id) {
		return iSuppliesService.viewDetail(id);
	}
	@GetMapping("/supplies")
	public Page<SuppliesDTO> pagingSupplies(@RequestParam(required = false, defaultValue = "") String provider, Pageable pageable){
		return iSuppliesService.findProvider(provider, pageable);
	}
	@PostMapping("/supplies")
	public SuppliesDTO createNew(@RequestBody @Valid SuppliesDTO suppliesDTO) {
		
		return iSuppliesService.create(suppliesDTO, idUser);
	}
	
	@PutMapping("/supplies")
	public SuppliesDTO update(@RequestBody @Valid SuppliesDTO suppliesDTO) {
		return iSuppliesService.update(suppliesDTO, idUser);
	}
	
	@DeleteMapping("/supplies/{id}")
	public void deleteNotAdmin(@PathVariable Long id) {
		 iSuppliesService.deleteNotAdmin(id, idUser);
	}
	
	@DeleteMapping("/supplies/admin/{id}")
	public void delete(@PathVariable Long id) {
		 iSuppliesService.delete(id, idUser);
	}
	
	
}
