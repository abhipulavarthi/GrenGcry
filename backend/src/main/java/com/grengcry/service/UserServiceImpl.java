package com.grengcry.service;

import com.grengcry.dto.request.UpdateUserRequest;
import com.grengcry.dto.response.PagedResponse;
import com.grengcry.dto.response.UserResponse;
import com.grengcry.exception.BadRequestException;
import com.grengcry.exception.ResourceNotFoundException;
import com.grengcry.model.entity.User;
import com.grengcry.model.enums.Role;
import com.grengcry.repository.UserRepository;
import com.grengcry.util.EntityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
// This class now correctly IMPLEMENTS the UserService interface
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    // This method is required by your UserController
    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(EntityMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PagedResponse<UserResponse> getUsers(Integer page, Integer limit, Role role) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<User> userPage;
        
        if (role != null) {
            userPage = userRepository.findByRole(role, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }
        
        List<UserResponse> users = userPage.getContent().stream()
            .map(EntityMapper::toUserResponse)
            .collect(Collectors.toList());
        
        return new PagedResponse<>(
            users,
            userPage.getTotalElements(),
            page,
            userPage.getTotalPages()
        );
    }
    
    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found", "id", id));
        return EntityMapper.toUserResponse(user);
    }
    
    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found", "id", id));
        
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        
        if (request.getEmail() != null) {
            if (!request.getEmail().equals(user.getEmail()) && 
                userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }
        
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        
        user = userRepository.save(user);
        return EntityMapper.toUserResponse(user);
    }
    
    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found", "id", id);
        }
        userRepository.deleteById(id);
    }
}