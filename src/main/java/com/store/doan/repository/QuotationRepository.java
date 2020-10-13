package com.store.doan.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.Quotation;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long>{
	
	Page<Quotation> findByNameOfCustomerLike(String nameOfCustomer, Pageable page);
}
