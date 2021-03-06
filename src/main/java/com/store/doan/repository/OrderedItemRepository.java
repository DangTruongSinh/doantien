package com.store.doan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.OrderedItem;

@Repository
public interface OrderedItemRepository extends JpaRepository<OrderedItem, Long>{
	
	Optional<OrderedItem> findByQuotationId(Long id);
	
}
