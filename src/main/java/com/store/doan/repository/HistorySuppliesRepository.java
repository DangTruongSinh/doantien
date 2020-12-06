package com.store.doan.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.HistorySupplies;

@Repository
public interface HistorySuppliesRepository extends JpaRepository<HistorySupplies, Long>{
	List<HistorySupplies> findBySuppliesId(Long id);
	void deleteByUserId(Long userId);

}
