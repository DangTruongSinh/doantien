package com.store.doan.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;


@Data
@Entity
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, length = 50)
	private String username;
	@Column(nullable = false, length = 20)
	private String password;
	@Column(length = 20)
	private String phone;
	@Column(length = 50)
	private String fullName;
	
	@ManyToOne
	@JoinColumn(name = "role_id")
	private Role role;
	
	
}
