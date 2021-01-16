package com.store.doan.api;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.store.doan.security.service.UserDetailsImpl;
import com.store.doan.service.IUserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class UserApi {
	
	
	
	@Autowired
	IUserService iUserService;

	@GetMapping("/users")
	public Page<UserDTO> pagingUser(@RequestParam(required = false, defaultValue = "", name = "username") String username,
			@RequestParam(required = false, defaultValue = "0", name = "page") Integer page, @RequestParam(required = false, defaultValue = "5", name = "size") Integer size) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return iUserService.findUsers(username, page, size, userDetails.getId());
	}

	@PostMapping("/users")
	@ResponseStatus(value = HttpStatus.CREATED)
	public UserDTO newUser(@RequestBody  UserDTO userDTO) {
		return iUserService.createNew(userDTO);
	}

	@PutMapping("/users")
	public UserDTO update(@RequestBody  UserDTO userDTO) {
		return iUserService.update(userDTO);
	}

	@PutMapping("/users/password")
	public void changePassword(@RequestBody UserDTO userDTO) {
		if(userDTO.getId() == null  || userDTO.getId() == 0) {
			UserDetailsImpl userDetails =
					(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			userDTO.setId(userDetails.getId());
		}
		iUserService.changePassword(userDTO);
	}
	
	@DeleteMapping("/users/{id}")
	public void deleteUser(@PathVariable Long id){
		iUserService.delete(id);
	}
	
	@GetMapping("/users/exist/{name}")
	public String checkExist(@PathVariable String name) {
		return iUserService.checkExist(name);
	}
}
