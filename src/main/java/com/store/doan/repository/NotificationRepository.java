package com.store.doan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.doan.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>{

}
