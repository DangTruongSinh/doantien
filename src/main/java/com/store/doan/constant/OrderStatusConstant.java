package com.store.doan.constant;

public enum OrderStatusConstant {
	WaitHandle("Chờ xử lý"), WaitProcess("Chờ thi công"), Processing("Đang thi công"), FishedProcess("Thi công hoàn tất"), Ship("Vận chuyển"), FishedShip("Vận chuyển thành công");
	
	String value;
	
	public String getValue() {
		return this.value;
	}
	
	private OrderStatusConstant(String value) {
		this.value = value;
	}
}
