package com.store.doan.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.UserNotification;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long>{
	
	
	Page<UserNotification> findByUserId(Long idUser, Pageable pageable);
	
	void deleteByUserIdAndOrderedItemId(Long userId, Long orderedItemId);
}
