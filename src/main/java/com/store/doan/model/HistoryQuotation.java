package com.store.doan.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
public class HistoryQuotation extends History{
	
	@ManyToOne
	@JoinColumn
	private Quotation quotation;
	
	@OneToOne(mappedBy = "historyQuotation")
	private HistoryOrders historyOrders;
}
