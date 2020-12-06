package com.store.doan.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.doan.dto.RoleDTO;
import com.store.doan.service.IRoleService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class RoleApi {
	
	@Autowired
	IRoleService iRoleService;
	
	@GetMapping("/roles")
	public List<RoleDTO> findAll(){
		return iRoleService.findAll();
	}
}
