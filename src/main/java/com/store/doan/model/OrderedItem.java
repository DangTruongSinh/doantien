package com.store.doan.model;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
public class OrderedItem extends Quotation{
	
	@Column(length = 20)
	private String phoneNumber;
	
	@Column(length = 50)
	private String email;
	
	private String address;

	private String specifications;
	
	@Column(length = 20)
	private String unit;

	@Column(length = 50)
	private String unitPrice;
	
	@ManyToOne
	@JoinColumn(name = "id_status_order")
	private OrderStatus status;
	
	private String filePathDrawing;
	
	private LocalDateTime orderDate;
	
	private LocalDateTime processDate;
	
	private LocalDateTime deliveryDate;
	
	@Column(columnDefinition = "text")
	private String note;
	
	@OneToMany(mappedBy = "orderedItem")
	private List<HistoryOrders> historyOrders;
	
	@OneToMany(mappedBy = "orderedItem")
	private List<Notification> notifications;
}
