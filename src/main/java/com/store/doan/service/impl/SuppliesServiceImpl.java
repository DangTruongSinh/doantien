package com.store.doan.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.store.doan.constant.MessageError;
import com.store.doan.constant.MessageHistory;
import com.store.doan.dto.HistoryDTO;
import com.store.doan.dto.SuppliesDTO;
import com.store.doan.dto.SuppliesDetailDTO;
import com.store.doan.exception.NotFoundException;
import com.store.doan.model.HistorySupplies;
import com.store.doan.model.Supplies;
import com.store.doan.model.User;
import com.store.doan.repository.HistorySuppliesRepository;
import com.store.doan.repository.SuppliesRepository;
import com.store.doan.repository.UserRepository;
import com.store.doan.service.ISuppliesService;
import com.store.doan.utils.UtilsCommon;

@Service
@Transactional
public class SuppliesServiceImpl implements ISuppliesService{
	
	static final Logger logger = LoggerFactory.getLogger(SuppliesServiceImpl.class);
	@Autowired
	SuppliesRepository suppliesRepository;
	
	@Autowired
	HistorySuppliesRepository historySupliesRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@Override
	public SuppliesDTO create(SuppliesDTO suppliesDTO, Long idUser) {
		// TODO Auto-generated method stub\
		// save supplies
		Supplies supplies = new Supplies();
		BeanUtils.copyProperties(suppliesDTO, supplies);
		suppliesRepository.saveAndFlush(supplies);
		//  history
		createHistory(idUser, supplies, MessageHistory.SUPPLIES_CREATED);
		//
		BeanUtils.copyProperties(supplies, suppliesDTO);
		logger.info("create new supplies success by account id: {}", idUser);
		return suppliesDTO;
	}



	@Override
	public SuppliesDTO update(SuppliesDTO suppliesDTO, Long idUser) {
		// TODO Auto-generated method stub
		// update supplies information 
		Supplies supplies = suppliesRepository.findById(suppliesDTO.getId()).orElseThrow(() -> new NotFoundException(MessageError.SUPPLIES_NOT_FOUND));
		StringBuilder contentUpdate = new StringBuilder();
		contentUpdate.append(MessageHistory.SUPPLIES_UPDATED);
		if(!suppliesDTO.getProvider().equals(supplies.getProvider())) {
			contentUpdate.append("Nhà cung cấp:");
			contentUpdate.append(supplies.getProvider());
			contentUpdate.append(" -> ");
			contentUpdate.append(suppliesDTO.getProvider());
		} else if(!suppliesDTO.getPrice().equals(supplies.getPrice())) {
			contentUpdate.append(". Giá:");
			contentUpdate.append(supplies.getPrice());
			contentUpdate.append(" -> ");
			contentUpdate.append(suppliesDTO.getPrice());
		} else if(!suppliesDTO.getCaculateUnit().equals(supplies.getCaculateUnit())) {
			contentUpdate.append(". Đơn vị tính:");
			contentUpdate.append(supplies.getCaculateUnit());
			contentUpdate.append(" -> ");
			contentUpdate.append(suppliesDTO.getCaculateUnit());
		} else if(!suppliesDTO.getDate().toString().equals(supplies.getDate().toString())) {
			contentUpdate.append(". Ngày ứng với đơn vị tính:");
			contentUpdate.append(supplies.getDate().toString());
			contentUpdate.append(" -> ");
			contentUpdate.append(suppliesDTO.getDate().toString());
		}
		BeanUtils.copyProperties(suppliesDTO, supplies);
		suppliesRepository.saveAndFlush(supplies);
		// create history
		createHistory(idUser, supplies, contentUpdate.toString());
		logger.info("update supplies success by account id: {}", idUser);
		return suppliesDTO;
	}

	@Override
	public void deleteNotAdmin(Long id, Long idUser) {
		// TODO Auto-generated method stub
		Supplies supplies = suppliesRepository.findById(id).orElseThrow(() -> new NotFoundException(MessageError.SUPPLIES_NOT_FOUND));
		supplies.setDelete(true);
		suppliesRepository.save(supplies);
		logger.info("status delete of id's supplies: {} was updated  by user id: {}", id, idUser);
	}

	@Override
	public void delete(Long id, Long idUser) {
		// TODO Auto-generated method stub
		Supplies supplies = suppliesRepository.findById(id).orElseThrow(() -> new NotFoundException(MessageError.SUPPLIES_NOT_FOUND));
		suppliesRepository.delete(supplies);
		logger.info("id supplies: {} was deleted by user id: {}", id, idUser);
	}

	@Override
	public SuppliesDetailDTO viewDetail(Long id) {
		// TODO Auto-generated method stub
		
		// check role. if admin then use findbyId else if manager then use findByIDAndIsdelete 
		
		//
		Supplies supplies = suppliesRepository.findById(id).orElseThrow(() -> new NotFoundException(MessageError.SUPPLIES_NOT_FOUND));
		SuppliesDetailDTO result = new SuppliesDetailDTO();
		BeanUtils.copyProperties(supplies, result);
		List<HistoryDTO> histories = new ArrayList<HistoryDTO>();
		List<HistorySupplies> historiesEntity = supplies.getLists(); 
		historiesEntity.forEach(item -> {
			HistoryDTO historyDTO = new HistoryDTO();
			historyDTO.setContent(item.getContent());
			historyDTO.setDate(item.getDateTime().toLocalDate());
			historyDTO.setNameUser(item.getUser().getUsername());
			historyDTO.setTime(item.getDateTime().toLocalTime());
			histories.add(historyDTO);
		});
		result.setHistorys(histories);
		return result;
	}

	@Override
	public Page<SuppliesDTO> findProvider(String provider, Pageable pageable) {
		// TODO Auto-generated method stub
		provider = UtilsCommon.concatString("%", provider, "%");
		Page<Supplies> pageSupplies = suppliesRepository.findByProviderLike(provider, pageable);
		List<SuppliesDTO> suppliesDTOs = new ArrayList<SuppliesDTO>();
		pageSupplies.getContent().forEach(supplies -> {
			SuppliesDTO suppliesDTO = new SuppliesDTO();
			BeanUtils.copyProperties(supplies, suppliesDTO);
			suppliesDTOs.add(suppliesDTO);
		});
		return new PageImpl<SuppliesDTO>(suppliesDTOs, pageable, pageSupplies.getTotalElements());
	}
	private void createHistory(Long idUser, Supplies supplies, String message) {
		HistorySupplies historySupplies = new HistorySupplies();
		historySupplies.setContent(message);
		User user = userRepository.findById(idUser).orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		historySupplies.setUser(user);
		historySupplies.setSupplies(supplies);
		historySupliesRepository.save(historySupplies);
	}
}
