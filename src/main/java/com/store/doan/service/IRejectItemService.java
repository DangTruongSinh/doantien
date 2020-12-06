package com.store.doan.service;

import com.store.doan.dto.RejectedItemDTO;

public interface IRejectItemService {
	
	public void updateReason(RejectedItemDTO rejectedItemDTO, long idUser);
	
	public String getReason(Long id);
}
