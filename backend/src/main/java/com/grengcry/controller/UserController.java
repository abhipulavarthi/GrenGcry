package com.grengcry.controller;

import com.grengcry.dto.request.UpdateUserRequest;
import com.grengcry.dto.response.ApiResponse;
import com.grengcry.dto.response.PagedResponse;
import com.grengcry.dto.response.UserResponse;
import com.grengcry.model.enums.Role;
import com.grengcry.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // GET http://localhost:8081/api/users?page=1&limit=10
    // Secured: Only Admins can view the full list of users.
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(required = false) Role role) {
        PagedResponse<UserResponse> response = userService.getUsers(page, limit, role);
        return ResponseEntity.ok(response);
    }

    // GET http://localhost:8081/api/users/1
    // Secured: A user can get their own info, or an admin can get anyone's info.
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isOwner(authentication, #id)")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // PUT http://localhost:8081/api/users/1
    // Secured: Admins can update any user.
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    // DELETE http://localhost:8081/api/users/1
    // Secured: Only Admins can delete users.
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully."));
    }
}