package com.store.doan.model;

import javax.persistence.Column;
import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper=false)
public class RejectedItem extends Quotation{
	
	@Column(columnDefinition = "text")
	private String reason;
}
