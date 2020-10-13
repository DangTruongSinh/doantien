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
	@Column(nullable = false, length = 50)
	private String username;
	@Column(nullable = false, length = 20)
	private String password;
	@Column(length = 20)
	private String phone;
	@Column(length = 50)
	private String fullName;
	
	@ManyToOne
	@JoinColumn
	private Role role;
	
	@OneToMany(mappedBy = "notification", cascade = CascadeType.ALL)
	private List<UserNotification> userNotification;
}
