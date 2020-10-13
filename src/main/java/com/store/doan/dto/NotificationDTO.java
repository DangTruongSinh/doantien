package com.store.doan.dto;

import lombok.Data;

@Data
public class NotificationDTO {
	
	private Long id;
	
	private Long idOrderedItem;
	
	private String boCode;
	
	private boolean isViewed = false;
	
	private String content;
}
