package com.store.doan.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.OneToMany;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper=false)
public class OrderStatus extends Status{
	
	@OneToMany(mappedBy = "status")
	private List<OrderedItem> orders;

	public OrderStatus(String name) {
		super(name);
		// TODO Auto-generated constructor stub
	}
	
	
}
