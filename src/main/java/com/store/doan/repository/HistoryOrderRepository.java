package com.store.doan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.HistoryOrders;

@Repository
public interface HistoryOrderRepository extends JpaRepository<HistoryOrders, Long>{

}
