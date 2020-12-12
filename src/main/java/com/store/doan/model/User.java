package com.store.doan.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Data;


@Data
@Entity
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String username;

	private String password;
	
	private String phone;
	
	private String fullName;
	
	@ManyToOne
	@JoinColumn
	private Role role;
	
	@OneToMany(mappedBy = "notification", cascade = CascadeType.ALL)
	private List<UserNotification> userNotification;
	
}
