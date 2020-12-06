package com.store.doan.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class SuppliesDTO {
	protected Long id;
	
	private String name;
	
	@NotBlank(message = "field provider is required!")
	private String provider;
	
	@NotBlank(message = "field unit caculate is required!")
	@Size(max = 50, message = "length of caculate unit is not except 50 characters!")
	private String caculateUnit;
	
	@Size(max = 100, message = "length of price is not except 100 characters!")
	protected String price;
	
	protected String date;
	
}
