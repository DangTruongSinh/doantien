package com.store.doan.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.store.doan.constant.MessageError;
import com.store.doan.dto.UserDTO;
import com.store.doan.exception.NotFoundException;
import com.store.doan.model.Role;
import com.store.doan.model.User;
import com.store.doan.repository.RoleRepository;
import com.store.doan.repository.UserRepository;
import com.store.doan.service.IUserService;
import com.store.doan.utils.UtilsCustom;

@Transactional
@Service
public class UserServiceImpl implements IUserService {

	@Autowired
	UserRepository userRepository;
	@Autowired
	RoleRepository roleRepository;

	static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

	@Override
	public UserDTO createNew(UserDTO userDTO) {

		// haspassword
		String passwordHash = UtilsCustom.hashPassword(userDTO.getPassword());
		userDTO.setPassword(passwordHash);
		//
		User user = new User();
		BeanUtils.copyProperties(userDTO, user);
		// set Role
		Role role = roleRepository.findByName(userDTO.getRole())
				.orElseThrow(() -> new NotFoundException(MessageError.ROLE_NOT_FOUND));
		user.setRole(role);
		// save
		userRepository.save(user);
		userDTO.setId(user.getId());
		logger.info("create user suceess!");
		return userDTO;
	}

	@Override
	public UserDTO update(UserDTO userDTO) {
		User user = userRepository.findById(userDTO.getId())
				.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		user.setFullName(userDTO.getFullName());
		user.setPhone(userDTO.getPhone());
		user.setUsername(userDTO.getUsername());
		if (!StringUtils.isEmpty(userDTO.getRole())) {
			Role role = roleRepository.findByName(userDTO.getRole())
					.orElseThrow(() -> new NotFoundException(MessageError.ROLE_NOT_FOUND));
			user.setRole(role);
		}
		// save
		userRepository.saveAndFlush(user);
		BeanUtils.copyProperties(user, userDTO);
		userDTO.setRole(user.getRole().getName());
		logger.info("update user suceess!");
		return userDTO;

	}

	@Override
	public void changePassword(UserDTO userDTO) {
		User user = userRepository.findById(userDTO.getId())
				.orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		String hashPassword = UtilsCustom.hashPassword(userDTO.getPassword());
		user.setPassword(hashPassword);
		userRepository.save(user);
		logger.info("%s change password success!", user.getUsername());
	}

	@Override
	public Page<UserDTO> findUsers(String username, Pageable pageable) {
		username = UtilsCustom.concatString("%", username, "%");
		Page<User> page = userRepository.findByUsernameLike(username, pageable);
		List<UserDTO> userDTOs = new ArrayList<UserDTO>();
		page.getContent().forEach(user -> {
			UserDTO userDto = new UserDTO();
			BeanUtils.copyProperties(user, userDto);
			userDto.setRole(user.getRole().getName());
			userDTOs.add(userDto);
		});
		return new PageImpl<UserDTO>(userDTOs, pageable, page.getTotalElements());
	}

	@Override
	public void delete(Long id) {
		// TODO Auto-generated method stub
		User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MessageError.USER_NOT_FOUND));
		userRepository.delete(user);
	}

}
