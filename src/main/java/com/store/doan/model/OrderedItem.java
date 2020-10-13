package com.store.doan.model;

import java.time.LocalDateTime;
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
import javax.persistence.OneToOne;

import lombok.Data;

@Entity
@Data
public class OrderedItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String address;

	private String specifications;
	
	@Column(length = 20)
	private String caculateUnit;
	
	@ManyToOne
	@JoinColumn(name = "id_status_order")
	private OrderStatus status;
	
	private String filePathDrawing;
	
	private LocalDateTime orderDate;
	
	private LocalDateTime processDate;
	
	private LocalDateTime deliveryDate;
	
	private boolean isDelete = false;
	
	@Column(columnDefinition = "text")
	private String note;
	
	@OneToMany(mappedBy = "orderedItem", cascade = {CascadeType.REMOVE, CascadeType.REFRESH, CascadeType.DETACH})
	private List<HistoryOrders> historyOrders;
	
	@OneToMany(mappedBy = "orderedItem", cascade = CascadeType.ALL)
	private List<UserNotification> userNotifications;
	
	@OneToOne
	@JoinColumn(referencedColumnName = "id", name = "quotation_id")
	private Quotation quotation;
}
