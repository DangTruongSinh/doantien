package com.store.doan.constant;

public enum OrderStatusConstant {
	WaitProcess("Chờ thi công"), Processing("Đang thi công"), FishedProcess("Thi công hoàn tất"), WaitShip("Giao hàng");
	
	String value;
	
	public String getValue() {
		return this.value;
	}
	
	private OrderStatusConstant(String value) {
		this.value = value;
	}
}
