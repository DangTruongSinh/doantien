package com.store.doan.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.OneToMany;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper=false)
public class QuotationStatus extends Status{
	
	@OneToMany(mappedBy = "quotationStatus")
	private List<Quotation> quotations;

	public QuotationStatus(String name) {
		super(name);
		// TODO Auto-generated constructor stub
	}

	public QuotationStatus() {
		super();
		// TODO Auto-generated constructor stub
	}
	
}
