package com.store.doan.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class HistoryDTO {
	
	private String content;
	
	private String nameUser;
	
	private LocalDate date;
	
	private LocalTime time;

}
