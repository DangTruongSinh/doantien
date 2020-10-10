package com.store.doan.constant;

public enum QuotationStatusConstant {
	Reject("Từ chối"), Confirm("Đồng ý");
	
	String value;
	
	private QuotationStatusConstant(String value) {
		this.value = value;
	}
	
	public String getValue() {
		return this.value;
	}
}
