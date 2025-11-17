package com.grengcry.service;

import com.grengcry.dto.request.UpdateUserRequest;
import com.grengcry.dto.response.PagedResponse;
import com.grengcry.dto.response.UserResponse;
import com.grengcry.model.enums.Role;
import java.util.List;

// This is now correctly defined as an interface
public interface UserService {

    // This is the method your UserController needs
    List<UserResponse> getAllUsers();

    // These are the other methods from your implementation
    PagedResponse<UserResponse> getUsers(Integer page, Integer limit, Role role);
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UpdateUserRequest request);
    void deleteUser(Long id);
}