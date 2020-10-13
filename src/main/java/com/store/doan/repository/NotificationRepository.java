package com.store.doan.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>{
	Page<Notification> findByKeyName(String keyName, Pageable pageable);
	Optional<Notification> findByKeyName(String keyName);
}
