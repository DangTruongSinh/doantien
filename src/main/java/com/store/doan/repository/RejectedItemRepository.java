package com.store.doan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.RejectedItem;

@Repository
public interface RejectedItemRepository extends JpaRepository<RejectedItem, Long>{
	Optional<RejectedItem> findByQuotationId(Long id);
}
