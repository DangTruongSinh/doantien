package com.store.doan.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.doan.constant.MessageError;
import com.store.doan.constant.MessageHistory;
import com.store.doan.constant.TypeAction;
import com.store.doan.dto.RejectedItemDTO;
import com.store.doan.exception.NotFoundException;
import com.store.doan.model.HistoryQuotation;
import com.store.doan.model.RejectedItem;
import com.store.doan.model.User;
import com.store.doan.repository.HistoryQuotationRepository;
import com.store.doan.repository.RejectedItemRepository;
import com.store.doan.repository.UserRepository;
import com.store.doan.service.IRejectItemService;

@Service
public class RejectItemServiceImpl implements IRejectItemService{

	@Autowired
	RejectedItemRepository rejectedItemRepository;
	
	@Autowired
	HistoryQuotationRepository historyQuotationRepository;
	
	@Autowired
	UserRepository userRepo;
	
	@Override
	public void updateReason(RejectedItemDTO rejectedItemDTO, long idUser) {
		// TODO Auto-generated method stub
		RejectedItem rejectedItem = rejectedItemRepository.findByQuotationId(
				rejectedItemDTO.getId()).orElseThrow(() -> new NotFoundException(MessageError.REJECTED_ITEM_NOT_FOUND));
		
		// get user change content
		User user = userRepo.findById(idUser).orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		// save history
		HistoryQuotation historyQuotation = new HistoryQuotation();
		historyQuotation.setAction(TypeAction.UPDATE.name());
		historyQuotation.setQuotation(rejectedItem.getQuotation());
		// build reason change
		StringBuilder builder = new StringBuilder();
		builder.append(MessageHistory.QUOTATION_CHANGE);
		builder.append(rejectedItem.getReason());
		builder.append(" -> ");
		builder.append(rejectedItemDTO.getReason());
		historyQuotation.setContent(builder.toString());
		historyQuotation.setUser(user);
		historyQuotationRepository.save(historyQuotation);
		// update rejected item
		rejectedItem.setReason(rejectedItemDTO.getReason());
		rejectedItemRepository.save(rejectedItem);

	}
	@Override
	public String getReason(Long idQuotation) {
		return rejectedItemRepository.getReason(idQuotation);
	}

}
