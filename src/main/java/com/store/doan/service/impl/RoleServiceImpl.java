package com.store.doan.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.doan.dto.RoleDTO;
import com.store.doan.model.Role;
import com.store.doan.repository.RoleRepository;
import com.store.doan.service.IRoleService;

@Service
public class RoleServiceImpl implements IRoleService{
	
	@Autowired
	RoleRepository roleRepository;
	@Override
	public List<RoleDTO> findAll() {
		// TODO Auto-generated method stub
		List<Role> list = roleRepository.findAll();
		List<RoleDTO> result = new ArrayList<RoleDTO>();
		list.forEach(role -> {
			RoleDTO roleDTO = new RoleDTO();
			roleDTO.setName(role.getName());
			result.add(roleDTO);
		});
		return result;
	}

}
