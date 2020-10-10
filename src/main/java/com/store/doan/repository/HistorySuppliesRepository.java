package com.store.doan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.HistorySupplies;

@Repository
public interface HistorySuppliesRepository extends JpaRepository<HistorySupplies, Long>{
}
