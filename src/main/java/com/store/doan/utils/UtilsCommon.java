package com.store.doan.utils;

import org.springframework.stereotype.Component;

@Component
public class UtilsCommon{
	
	
	public static String concatString(String... strings) {
		StringBuffer buffer = new StringBuffer();
		for(String x : strings)
			buffer.append(x);
		return buffer.toString();
	}
	
	public static String hashPassword(String password) {
		
		return password;
	}
	
	public boolean sendEmail(String emailTo, String message) {
		System.out.println("send mail success!");
		return true;
	}
}
