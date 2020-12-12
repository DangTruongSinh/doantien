package com.store.doan.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.store.doan.constant.QuotationStatusConstant;
import com.store.doan.constraint.anotation.ValidateEnum;

import lombok.Data;

@Data
public class QuotationDTO {
	
	private Long id;
	
	private Long idQuotation;
	
	private String name;
	
	private String boCode;

	private String nameOfCustomer;

	private int quantity;
	
	private String phoneNumber;
	
	private String email;
	
	@ValidateEnum(targetClassType = QuotationStatusConstant.class, message = "status is not match")
	private String quotationStatus;
	
	private String price;
	
	private List<HistoryDTO> quotationHistories;
	
	private LocalDateTime createdDate;
	
	private String reason;
	
	private String statusOrder;
	
	private String deliveryDate;
	
	private LocalDateTime realDeliveryDate;
}
