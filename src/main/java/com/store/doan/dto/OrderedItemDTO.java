package com.store.doan.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.store.doan.model.OrderStatus;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class OrderedItemDTO extends QuotationDTO{

	private String address;

	private String specifications;

	private String caculateUnit;

	private OrderStatus status;

	private String filePathDrawing;

	private LocalDateTime orderDate;

	private LocalDateTime processDate;

	private LocalDateTime deliveryDate;
	
	private String note;
	
	private List<HistoryDTO> orderedItemHistories;
}
