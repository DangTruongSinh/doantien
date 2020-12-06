package com.store.doan.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.store.doan.model.HistoryQuotation;

public interface HistoryQuotationRepository extends JpaRepository<HistoryQuotation, Long>{
	
	List<HistoryQuotation> findByQuotationId(Long id);
	
	void deleteByUserId(Long userId);
}
