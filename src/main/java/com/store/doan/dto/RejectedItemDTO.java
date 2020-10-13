package com.store.doan.dto;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class RejectedItemDTO extends QuotationDTO {
	
	private String reason;
	
	private List<HistoryDTO> rejectedItemHistories;
}
