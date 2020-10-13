package com.store.doan.dto;

import java.util.List;

import javax.validation.constraints.Size;

import com.store.doan.constant.QuotationStatusConstant;
import com.store.doan.constraint.anotation.ValidateEnum;

import lombok.Data;

@Data
public class QuotationDTO {
	
	private Long id;

	@Size(max = 50, message = "length's bOCode is not except 50 characters!")
	private String boCode;

	@Size(max = 50, message = "length's name is not except 50 characters!")
	private String nameOfCustomer;

	private int quantity;
	
	@Size(max = 20,  message = "length's phone number is not except 20 characters")
	private String phoneNumber;
	
	@Size(max = 50, message = "length's email is not except 50 characters")
	private String email;
	
	@ValidateEnum(targetClassType = QuotationStatusConstant.class, message = "status is not match")
	private String quotationStatus;
	
	private String price;
	
	private List<HistoryDTO> quotationHistories;
}
