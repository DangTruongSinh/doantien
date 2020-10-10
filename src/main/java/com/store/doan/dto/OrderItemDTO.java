package com.store.doan.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.store.doan.model.OrderStatus;

import lombok.Data;

@Data
public class OrderItemDTO {

	private Long id;

	private String bOCode;

	private String nameOfCustomer;

	private int quantity;

	private String phoneNumber;

	private String email;

	private String address;

	private String specifications;

	private String unit;

	private String unitPrice;

	private OrderStatus status;

	private String filePathDrawing;

	private LocalDateTime orderDate;

	private LocalDateTime processDate;

	private LocalDateTime deliveryDate;
	
	private String note;
	
	private List<HistoryDTO> historys;
}
