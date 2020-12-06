package com.store.doan.exception;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequest;

// custom timestamp when handlerexception send error

@Component
public class CustomErrorAttributes extends DefaultErrorAttributes {
	private static final DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	
	private static final Logger logger = LoggerFactory.getLogger(CustomErrorAttributes.class);

	@Override
	public Map<String, Object> getErrorAttributes(WebRequest webRequest, boolean includeStackTrace) {
		
		// write log at here
		
		// log info user thought webRequest
		Throwable ex =  super.getError(webRequest);
		if(ex != null) {
			ex.printStackTrace(); // print log errors to console
		}
		if(webRequest.getUserPrincipal() != null)
			logger.error(webRequest.getUserPrincipal().getName(), ex);
		// Let Spring handle the error first, we will modify later :)
		Map<String, Object> errorAttributes = super.getErrorAttributes(webRequest, includeStackTrace);

		// format & update timestamp
		Object timestamp = errorAttributes.get("timestamp");
		if (timestamp == null) {
			errorAttributes.put("timestamp", dateFormat.format(new Date()));
		} else {
			errorAttributes.put("timestamp", dateFormat.format((Date) timestamp));
		}
		return errorAttributes;
	}

}
