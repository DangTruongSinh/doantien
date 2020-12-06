package com.store.doan.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.Quotation;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long>{
	
//	@Query(value = "select * from quotation a join quotation_status b  on  a.id_status_quotation = b.id where b.name=:q_status and name_of_customer=:nameOfCustomer and is_deleted=:isDeleted limit :offset, :limit", nativeQuery = true)
	Page<Quotation> findByNameOfCustomerLikeAndIsDeletedIsAndQuotationStatusNameLike(String nameOfCustomer, Pageable pageable, boolean isDeleted, String quotationStatus);
	
	Page<Quotation> findByBoCodeLikeAndIsDeletedIsAndQuotationStatusNameLike(String boCode, Pageable pageable, boolean isDeleted, String quotationStatus);
}
