package com.grengcry.controller;

import com.grengcry.dto.request.CreateOrderRequest;
import com.grengcry.dto.request.UpdateOrderStatusRequest;
import com.grengcry.dto.response.ApiResponse;
import com.grengcry.dto.response.OrderResponse;
import com.grengcry.dto.response.PagedResponse;
import com.grengcry.model.enums.OrderStatus;
import com.grengcry.security.CustomUserDetails; // Make sure this import exists
import com.grengcry.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    // GET /api/orders (Admin Only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<OrderResponse>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        PagedResponse<OrderResponse> response = orderService.getOrders(status, page, limit);
        return ResponseEntity.ok(response);
    }
    
    // GET /api/orders/1 (Admin or the user who owns the order)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isOrderOwner(authentication, #id)")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(response);
    }
    
    // POST /api/orders (Authenticated Users Only)
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal CustomUserDetails currentUser, // Gets the logged-in user
            @Valid @RequestBody CreateOrderRequest request) {
        
        OrderResponse response = orderService.createOrder(currentUser.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    // PUT /api/orders/1/status (Admin Only)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(response);
    }
}