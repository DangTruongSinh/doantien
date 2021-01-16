package com.store.doan.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class OrderedItemDTO extends QuotationDTO{

	private String address;
	
	private String specifications;

	private String caculateUnit;

	private String status;

	private String filePathDrawing;

	private LocalDateTime orderDate;

	private LocalDateTime processDate;
	
	private LocalDateTime realDeliveryDate;
	
	private String note;
	
	private List<HistoryDTO> orderedItemHistories;
	
	
}
