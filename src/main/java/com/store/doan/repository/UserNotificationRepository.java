package com.store.doan.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.store.doan.model.UserNotification;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long>{
	
	
	Page<UserNotification> findByUserIdAndIsViewedIsOrderByDateCreateDesc(Long idUser, Pageable pageable, boolean isViewd);
	
	void deleteByUserIdAndOrderedItemId(Long userId, Long orderedItemId);
	
	List<UserNotification> findByOrderedItemIdAndUserId(Long idOrderedItem, Long idUser);
	
	void deleteByUserId(Long userId);
	
	
	@Query("update UserNotification u set u.isViewed = true where u.orderedItem.id = ?1 and u.user.id = ?2")
	@Modifying
	void deleteByOrderId(Long id, Long idUser);

}
