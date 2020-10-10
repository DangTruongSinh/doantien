package com.store.doan.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.store.doan.dto.UserDTO;
import com.store.doan.service.IUserService;

@RestController

public class UserController {

	@Autowired
	IUserService iUserService;

	@GetMapping("/users")
	public Page<UserDTO> pagingUser(@RequestParam(required = false, defaultValue = "") String username,
			Pageable pageable) {
		return iUserService.findUsers(username, pageable);
	}

	@PostMapping("/users")
	@ResponseStatus(value = HttpStatus.CREATED)
	public UserDTO newUser(@RequestBody @Valid UserDTO userDTO) {
		return iUserService.createNew(userDTO);
	}

	@PutMapping("/users")
	public UserDTO update(@RequestBody @Valid UserDTO userDTO) {
		return iUserService.update(userDTO);
	}

	@PutMapping("/users/password")
	public void changePassword(@RequestBody UserDTO userDTO) {
		iUserService.changePassword(userDTO);
	}
	
	@DeleteMapping("/users/{id}")
	public void deleteUser(@PathVariable Long id){
		iUserService.delete(id);
	}
}
