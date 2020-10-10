package com.store.doan.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Entity
public class HistoryOrders extends History{
	
	
	@ManyToOne
	@JoinColumn(name = "orderedItem_id")
	private OrderedItem orderedItem;
}
