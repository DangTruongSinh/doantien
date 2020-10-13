package com.store.doan.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;

@Entity
@Data
public class UserNotification{
	
	@Id
	@GeneratedValue
	private Long id;
	
	
	@ManyToOne
	@JoinColumn
	private OrderedItem orderedItem;
	
	@ManyToOne
	@JoinColumn
	private User user; 
	
	@ManyToOne
	@JoinColumn
	private Notification notification;
	
	private boolean isViewed;
}
