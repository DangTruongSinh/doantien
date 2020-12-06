package com.store.doan.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NotificationDTO {
	
	private Long id;
	
	private Long idQuotation;
	
	private Long idOrderedItem;
	
	private Long idUser;
	
	private String boCode;
	
	private boolean isViewed = false;
	
	private String content;
	
	private LocalDateTime dateCreated;
}
