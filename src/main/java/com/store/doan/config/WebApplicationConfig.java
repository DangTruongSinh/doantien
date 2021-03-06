package com.store.doan.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebApplicationConfig implements WebMvcConfigurer {

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		System.out.println("notfound is run");
		registry.addViewController("/notFound").setViewName("forward:/index.html");
	}

	@Bean
	public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> containerCustomizer() {
		return container -> {
			Set<ErrorPage> errors = new HashSet<ErrorPage>();
			ErrorPage error = new ErrorPage(HttpStatus.NOT_FOUND, "/notFound");
			errors.add(error);
			container.setErrorPages(errors);
		};
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Bean
	public FilterRegistrationBean filterRegistrationBean() {
	    CharacterEncodingFilter filter = new CharacterEncodingFilter();
	    filter.setEncoding("UTF-8");

	    FilterRegistrationBean registrationBean = new FilterRegistrationBean();
	    registrationBean.setFilter(filter);
	    registrationBean.addUrlPatterns("/*");
	    return registrationBean;
	}

}