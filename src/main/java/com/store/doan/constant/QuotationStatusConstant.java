package com.store.doan.constant;

public enum QuotationStatusConstant {
	UNKNOWN("Chưa xác định"),REJECT("Từ chối"), CONFIRM("Đồng ý");
	
	String value;
	
	private QuotationStatusConstant(String value) {
		this.value = value;
	}
	
	public String getValue() {
		return this.value;
	}
}
