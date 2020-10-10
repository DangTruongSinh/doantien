package com.store.doan.utils;

public class UtilsCustom{
	
	
	public static String concatString(String...strings) {
		StringBuffer buffer = new StringBuffer();
		for(String x : strings)
			buffer.append(x);
		return buffer.toString();
	}
	
	public static String hashPassword(String password) {
		
		return password;
	}
}
