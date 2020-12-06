package com.store.doan.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class HistoryDTO {
	
	private String content;
	
	private String nameUser;
	
	private LocalDateTime dateTime;
	
	private String action;
}
