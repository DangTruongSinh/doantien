package com.store.doan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DoanApplication {

	public static void main(String[] args) {
		SpringApplication.run(DoanApplication.class, args);
	}
	

}
