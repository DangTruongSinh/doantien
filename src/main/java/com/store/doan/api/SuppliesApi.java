package com.store.doan.api;

import java.io.UnsupportedEncodingException;
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

import com.store.doan.dto.HistoryDTO;
import com.store.doan.dto.SuppliesDTO;
import com.store.doan.security.service.UserDetailsImpl;
import com.store.doan.service.IHistorySuppliesService;
import com.store.doan.service.ISuppliesService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class SuppliesApi {
	
	@Autowired
	ISuppliesService iSuppliesService;
	
	@Autowired
	IHistorySuppliesService iHistoryService;
	
	Logger logger = LoggerFactory.getLogger(SuppliesApi.class);
	
	@GetMapping("/supplies/histories/{id}")
	public List<HistoryDTO> viewHistory(@PathVariable Long id) {
		return iHistoryService.getAll(id);
	}
	@GetMapping("/supplies")
	public Page<SuppliesDTO> pagingSupplies(@RequestParam(required = false, defaultValue = "") String provider, 
			@RequestParam(required = false, defaultValue = "0", name = "page") Integer page, @RequestParam(required = false, defaultValue = "5", name = "size") Integer size,
			@RequestParam(required = false, defaultValue = "false", name = "isDelete") Boolean isDelete) throws UnsupportedEncodingException{
		logger.info("provider {}", provider);
		Sort sort = Sort.by("date").descending();
		Pageable pageable = PageRequest.of(page, size, sort);
		return iSuppliesService.findProvider(provider, pageable, isDelete);
	}
	@PostMapping("/supplies")
	public SuppliesDTO createNew(@RequestBody  SuppliesDTO suppliesDTO) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return iSuppliesService.create(suppliesDTO, userDetails.getId());
	}
	
	@PutMapping("/supplies")
	public SuppliesDTO update(@RequestBody SuppliesDTO suppliesDTO) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return iSuppliesService.update(suppliesDTO, userDetails.getId());
	}
	
	@DeleteMapping("/supplies/{id}")
	public void deleteNotAdmin(@PathVariable Long id) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		 iSuppliesService.deleteNotAdmin(id, userDetails.getId());
	}
	
	@DeleteMapping("/supplies/admin/{id}")
	public void delete(@PathVariable Long id) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		 iSuppliesService.delete(id, userDetails.getId());
	}
	
	
}
