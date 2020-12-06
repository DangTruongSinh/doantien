package com.store.doan.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.doan.dto.HistoryDTO;
import com.store.doan.model.HistoryQuotation;
import com.store.doan.repository.HistoryQuotationRepository;
import com.store.doan.service.IHistoryQuotationsService;

@Service
public class HistoryQuotationServiceImpl implements IHistoryQuotationsService{

	@Autowired
	HistoryQuotationRepository historyQuotationRepository;
	@Override
	public List<HistoryDTO> getAll(Long idItem) {
		List<HistoryDTO> histories = new ArrayList<HistoryDTO>();
		List<HistoryQuotation> historiesEntity = historyQuotationRepository.findByQuotationId(idItem);
		historiesEntity.forEach(item -> {
			HistoryDTO historyDTO = new HistoryDTO();
			historyDTO.setContent(item.getContent());
			historyDTO.setDateTime(item.getDateTime());
			historyDTO.setNameUser(item.getUser().getUsername());
			historyDTO.setAction(item.getAction());
			histories.add(historyDTO);
		});
		
		return histories;
	}

}
