package com.store.doan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.store.doan.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	Page<User> findByUsernameLike(String username, Pageable pageable);
	
	List<User> findByRoleNameNot(String name);
	
	Optional<User> findByUsername(String username);
	
	
	@Query("select u from User u where id  != ?1")
	List<User> findByNotIdUser(long id);
	
}
