package com.store.doan;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
	
	@RequestMapping(value = {"/login", "/app/accounts**", "/app/supplies**", "/app/quotations**", "/app/orders**", "/app/notifications**","/app/order/**"}) 
//	@RequestMapping(value = {"/notFound"}) 
	public String index() {
		return "forward:/index.html";
	}

}