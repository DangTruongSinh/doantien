package com.store.doan.model;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Data;

@Entity
@Data
@EntityListeners(AuditingEntityListener.class)
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
	
	@CreationTimestamp
	private LocalDateTime dateCreate;
}
