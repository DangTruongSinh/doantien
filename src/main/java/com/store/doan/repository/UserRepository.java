package com.store.doan.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	Page<User> findByUsernameLike(String username, Pageable pageable);
	
	List<User> findByRoleNameNot(String name);
}
