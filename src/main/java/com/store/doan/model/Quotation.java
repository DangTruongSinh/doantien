package com.store.doan.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Data;

@Entity
@Data
public  class Quotation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(length = 50)
	private String boCode;
	
	@Column(length = 50)
	private String nameOfCustomer;
	
	private int quantity;
	
	@Column(length = 20)
	private String phoneNumber;
	
	@Column(length = 50)
	private String email;
	
	@Column(length = 50)
	private String price;
	
	@ManyToOne
	@JoinColumn(name = "id_status_quotation")
	private QuotationStatus qStatus;
	
	@OneToMany(mappedBy = "quotation", cascade = {CascadeType.DETACH, CascadeType.REMOVE, CascadeType.REFRESH})
	private List<HistoryQuotation> histories;
	
	private boolean isDeleted;
}
