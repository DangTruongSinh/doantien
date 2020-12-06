package com.store.doan.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.store.doan.dto.RejectedItemDTO;
import com.store.doan.security.service.UserDetailsImpl;
import com.store.doan.service.IRejectItemService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class RejectItemApi {
	
	@Autowired
	IRejectItemService iRejectItemService;
	
	@PutMapping("/rejectitem/reason")
	public void updateReason(@RequestBody RejectedItemDTO rejectedItemDTO) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		iRejectItemService.updateReason(rejectedItemDTO, userDetails.getId());
	}
	
	@GetMapping("/rejectitem/reason/{id}")
	public String getReason(@PathVariable Long id) {
		return iRejectItemService.getReason(id);
	}
}
