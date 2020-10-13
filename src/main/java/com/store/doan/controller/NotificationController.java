package com.store.doan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.store.doan.dto.NotificationDTO;
import com.store.doan.service.INotificationService;

@RestController
public class NotificationController {
	
	@Autowired
	INotificationService iNotificationService;
	
	long idUser = 1l;
	
	@GetMapping("/notifications")
	public Page<NotificationDTO> paging(Pageable pageable){
		return iNotificationService.findAllIsViewed(idUser, false, pageable);
	}
	
	@DeleteMapping("/notifications/{id}")
	public void delete(@PathVariable Long id) {
		 iNotificationService.delete(id, idUser);
	}
}
