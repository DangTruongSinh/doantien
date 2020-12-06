package com.store.doan.service;

import org.springframework.data.domain.Page;

import com.store.doan.dto.UserDTO;


public interface IUserService {
	
	UserDTO createNew(UserDTO userDTO);
	
	UserDTO update(UserDTO userDTO);
	
	void changePassword(UserDTO userDTO);
	
	
	Page<UserDTO> findUsers(String username, Integer page, Integer size, Long id);
	
	void delete(Long id);
}
