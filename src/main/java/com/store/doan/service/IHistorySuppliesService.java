package com.store.doan.service;

import java.util.List;

import com.store.doan.dto.HistoryDTO;

public interface IHistorySuppliesService {
	List<HistoryDTO> getAll(Long idItem);
}
