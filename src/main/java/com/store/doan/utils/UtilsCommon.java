package com.store.doan.utils;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.store.doan.constant.OrderStatusConstant;
import com.store.doan.constant.RoleConstant;
import com.store.doan.model.User;
import com.store.doan.repository.UserRepository;

@Component
public class UtilsCommon {

	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	UserRepository userRepository;

	public static String concatString(String... strings) {
		StringBuffer buffer = new StringBuffer();
		for (String x : strings)
			buffer.append(x);
		return buffer.toString();
	}

	public void sendEmail(String username, String boCode, String... status) {
		String newStatusOrder = "";
		StringBuilder message = new StringBuilder();
		message.append("account có username ");
		message.append(username);
		
		
		if(status.length == 2) {
			String oldStatusOrder = status[0];
			newStatusOrder = status[1];
			message.append(" đã thay đổi tình trạng đơn hàng từ ");
			message.append(oldStatusOrder);
			message.append(" sang ");
			message.append(newStatusOrder);
		} else {
			newStatusOrder = status[0];
			message.append(" đã tạo đơn hàng với tình trạng ");
			message.append(OrderStatusConstant.WaitProcess.getValue());
		}
		StringBuilder subject = new StringBuilder();
		subject.append("Đơn hàng ");
		subject.append("có mã ");
		subject.append(boCode);
		subject.append(" ");
		subject.append(newStatusOrder);
	
		// send for special user.
		List<User> users = new ArrayList<User>();
		if (newStatusOrder.equals(OrderStatusConstant.WaitProcess.getValue())
				|| newStatusOrder.equals(OrderStatusConstant.Processing.getValue())
				|| newStatusOrder.equals(OrderStatusConstant.FishedProcess.getValue())) {
			users.addAll(userRepository.findAll());
		} else {
			users.addAll(userRepository.findByRoleNameNot(RoleConstant.ENGINEERING.name()));
		}
		if (users.size() > 0) {
			List<String> emails = new ArrayList<String>();
			for (User u : users) {
				emails.add(u.getUsername());
			}
			for(String email : emails) {
				new Thread(new Runnable() {
					@Override
					public void run() {
						try {
							// TODO Auto-generated method stub
							SimpleMailMessage msg = new SimpleMailMessage();
							msg.setTo(email);
							msg.setSubject(subject.toString());
							msg.setText(message.toString());
							javaMailSender.send(msg);
							logger.info("send mail success with username account: " + email);
						} catch (Exception e) {
							// TODO: handle exception
							e.printStackTrace();
							logger.error("send mail error with username account: " + email);
						}
					}
				}).start();
			}
		}

	}

}
