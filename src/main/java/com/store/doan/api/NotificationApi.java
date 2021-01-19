package com.store.doan.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.doan.dto.NotificationDTO;
import com.store.doan.security.service.UserDetailsImpl;
import com.store.doan.service.INotificationService;

@RestController
@CrossOrigin(origins  = "http://localhost:3000", maxAge = 3600)
public class NotificationApi {
	
	@Autowired
	INotificationService iNotificationService;
	
	
	@GetMapping("/notifications")
	public Page<NotificationDTO> paging(Pageable pageable, @RequestParam(name = "isView", required = false, defaultValue = "false") boolean isView){
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return iNotificationService.findAllIsViewed(userDetails.getId(), isView, pageable);
	}
	
	@DeleteMapping("/notifications/{idOrder}")
	public void delete(@PathVariable Long idOrder) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		 iNotificationService.delete(idOrder, userDetails.getId());
	}
	
	@DeleteMapping("/notifications/delete/{id}")
	public void deleteNo(@PathVariable Long id) {
		iNotificationService.deleteNo(id);
	}
}
