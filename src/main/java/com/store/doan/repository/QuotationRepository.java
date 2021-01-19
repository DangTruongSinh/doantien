package com.store.doan.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.store.doan.model.Quotation;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long>{
	
//	@Query(value = "select * from quotation a join quotation_status b  on  a.id_status_quotation = b.id where b.name=:q_status and name_of_customer=:nameOfCustomer and is_deleted=:isDeleted limit :offset, :limit", nativeQuery = true)
	//Page<Quotation> findByNameOfCustomerLikeAndIsDeletedIsAndQuotationStatusNameLike(String nameOfCustomer, Pageable pageable, boolean isDeleted, String quotationStatus);
	
	Page<Quotation> findByBoCodeLikeAndIsDeletedIsAndQuotationStatusNameLike(String boCode, Pageable pageable, boolean isDeleted, String quotationStatus);
	
	@Query(value = "select q from OrderedItem o left join Quotation q on o.quotation.id = q.id left join OrderStatus s on o.status.id = s.id where s.name in('Đang thi công', 'Chờ thi công', 'Thi công hoàn tất') and q.boCode like ?1 and o.isDelete = false")
	Page<Quotation> findOrderByFullEngineering(String boCode, Pageable pageable);
	@Query(value = "select q from OrderedItem o left join Quotation q on o.quotation.id = q.id left join OrderStatus s on o.status.id = s.id where s.name in(?2) and q.boCode like ?1 and o.isDelete = false")
	Page<Quotation> findOrderByTypeEngineering(String boCode, String type, Pageable pageable);
	List<Quotation> findByBoCodeLike(String name);
}
