package com.grengcry.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private UserResponse user;
    private List<OrderItemResponse> items;
    private BigDecimal total;
    
    // THE FIX: Changed the type from "OrderStatus" to "String"
    private String status; 

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}