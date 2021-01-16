package com.store.doan.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.Supplies;

@Repository
public interface SuppliesRepository extends JpaRepository<Supplies, Long>{
	Page<Supplies> findByNameLikeAndIsDeleteIs(String provider, Pageable pageable, boolean isDelete);
}
