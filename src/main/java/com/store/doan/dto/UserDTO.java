package com.store.doan.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import com.store.doan.constant.RoleConstant;
import com.store.doan.constraint.anotation.ValidateEnum;

import lombok.Data;

@Data
public class UserDTO {
	
	@Min(value = 1)
	private Long id;
	
	private String name;
	
	@NotBlank(message = "username is required!")
	private String username;
	
	private String password;
	
	@NotBlank(message = "fullname is required!")
	private String fullName;
	
	@NotBlank(message = "phone is required!")
	private String phone;
	
	@ValidateEnum(targetClassType =  RoleConstant.class, message = "role is not match!")
	private String role;

	public UserDTO(String username, String password, String fullName, String phone, String role) {
		this.username = username;
		this.password = password;
		this.fullName = fullName;
		this.phone = phone;
		this.role = role;
	}
	
	public UserDTO() {
		
	}
	

}
