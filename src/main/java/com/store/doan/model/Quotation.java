package com.store.doan.model;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Data;

@Entity
@Data
@EntityListeners(AuditingEntityListener.class)
public  class Quotation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(length = 50)
	private String boCode;
	
	private String name;
	
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
	@JoinColumn
	private QuotationStatus quotationStatus;
	
	@OneToMany(mappedBy = "quotation", cascade = {CascadeType.DETACH, CascadeType.REMOVE, CascadeType.REFRESH})
	private List<HistoryQuotation> histories;
	
	private boolean isDeleted;
	@CreationTimestamp
	private LocalDateTime createdDate = LocalDateTime.now();
	
	@OneToOne(mappedBy = "quotation", cascade = CascadeType.ALL)
	private RejectedItem rejectedItem;
	
	@OneToOne(mappedBy = "quotation", cascade  = CascadeType.ALL)
	private OrderedItem orderedItem;
	
}
