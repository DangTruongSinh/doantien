package com.store.doan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.QuotationStatus;

@Repository
public interface QuotationStatusRepository extends JpaRepository<QuotationStatus, Long>{

}
