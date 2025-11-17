package com.grengcry.util;

import com.grengcry.dto.response.*;
import com.grengcry.model.entity.*;
import java.util.stream.Collectors;

public class EntityMapper {

    public static UserResponse toUserResponse(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    // NEW METHOD for Products
    public static ProductResponse toProductResponse(Product product) {
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setCategory(product.getCategory());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setImage(product.getImage());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }

    // NEW METHOD for Orders
    public static OrderResponse toOrderResponse(Order order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        // Map the associated user to a UserResponse DTO
        if (order.getUser() != null) {
            dto.setUser(toUserResponse(order.getUser()));
        }
        // Map the list of OrderItem entities to a list of OrderItemResponse DTOs
        dto.setItems(order.getItems().stream()
                .map(EntityMapper::toOrderItemResponse)
                .collect(Collectors.toList()));
        dto.setTotal(order.getTotal());
        dto.setStatus(order.getStatus().name());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }
    
    // NEW HELPER METHOD for OrderItems
    public static OrderItemResponse toOrderItemResponse(OrderItem orderItem) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.setId(orderItem.getId());
        // Map the associated product to a ProductResponse DTO
        if (orderItem.getProduct() != null) {
            dto.setProduct(toProductResponse(orderItem.getProduct()));
        }
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        return dto;
    }
    
    // NEW METHOD for Feedback
    public static FeedbackResponse toFeedbackResponse(Feedback feedback) {
        FeedbackResponse dto = new FeedbackResponse();
        dto.setId(feedback.getId());
        if (feedback.getUser() != null) {
            dto.setUser(toUserResponse(feedback.getUser()));
        }
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setCreatedAt(feedback.getCreatedAt());
        dto.setUpdatedAt(feedback.getUpdatedAt());
        return dto;
    }
}