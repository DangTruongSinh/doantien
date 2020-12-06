package com.store.doan.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.store.doan.constant.RoleConstant;
import com.store.doan.constraint.anotation.ValidateEnum;

import lombok.Data;

@Data
public class UserDTO {
	
	@Min(value = 0)
	private Long id;
	
	private String name;
	
	@Size(max = 50, message = "length's username is not except 50 characters!")
	@NotBlank(message = "username is required!")
	private String username;
	
	@Size(max = 20, message = "length's password is not except 20 characters!")
	private String password;
	
	@Size(max = 50, message = "length's fullname is not except 50 characters!")
	@NotBlank(message = "fullname is required!")
	private String fullName;
	
	@Size(max = 20, message = "length's phone is not except 20 characters!")
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
