package com.store.doan.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Data;

@Data
@Entity
public class Supplies {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private String provider;
	
	private String price;
	
	private String date;
	
	private String caculateUnit;
	
	@OneToMany(mappedBy = "supplies", cascade = {CascadeType.DETACH, CascadeType.REFRESH, CascadeType.REMOVE})
	private List<HistorySupplies> lists;

	private boolean isDelete = false;
}
