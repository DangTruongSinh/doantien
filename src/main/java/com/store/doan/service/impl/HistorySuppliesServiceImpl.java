package com.store.doan.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.doan.dto.HistoryDTO;
import com.store.doan.model.HistorySupplies;
import com.store.doan.repository.HistorySuppliesRepository;
import com.store.doan.service.IHistorySuppliesService;

@Service
public class HistorySuppliesServiceImpl implements IHistorySuppliesService{

	@Autowired
	HistorySuppliesRepository historySupliesRepository;
	
	@Override
	public List<HistoryDTO> getAll(Long idItem) {
		// TODO Auto-generated method stub
		List<HistoryDTO> histories = new ArrayList<HistoryDTO>();
		List<HistorySupplies> historiesEntity = historySupliesRepository.findBySuppliesId(idItem);
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
