package com.store.doan.dto;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class SuppliesDTO {
	protected Long id;
	
	private String name;
	
	@NotBlank(message = "field provider is required!")
	private String provider;
	
	@NotBlank(message = "field unit caculate is required!")
	private String caculateUnit;
	
	protected String price;
	
	protected String date;
	
}
