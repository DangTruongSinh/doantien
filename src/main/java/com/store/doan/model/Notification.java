package com.store.doan.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Data;

@Entity
@Data
public class Notification {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(length = 100)
	private String content;
	
	@Column(length = 100)
	private String keyName;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<UserNotification> userNotification;

	public Notification(String content) {
		super();
		this.content = content;
	}

	public Notification() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
}


