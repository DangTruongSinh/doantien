package com.store.doan.dto;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class SuppliesDetailDTO extends SuppliesDTO{
	
	private List<HistoryDTO> historys;
}
