package com.store.doan.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Quotation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Getter @Setter
	private Long id;
	
	@Getter @Setter
	private String bOCode;
	
	@Column(length = 50)
	@Getter @Setter
	private String nameOfCustomer;
	
	@Getter @Setter
	private int quantity;
	
	@ManyToOne
	@JoinColumn(name = "id_status_quotation")
	@Getter @Setter
	private QuotationStatus qStatus;
}
