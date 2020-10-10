package com.store.doan.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
public class HistorySupplies extends History{
	
	@ManyToOne
	@JoinColumn
	private Supplies supplies;
}
