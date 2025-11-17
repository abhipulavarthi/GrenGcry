package com.grengcry.service;

import com.grengcry.dto.request.CreateOrderRequest;
import com.grengcry.dto.request.UpdateOrderStatusRequest;
import com.grengcry.dto.response.OrderResponse;
import com.grengcry.dto.response.PagedResponse;
import com.grengcry.exception.BadRequestException;
import com.grengcry.exception.ResourceNotFoundException;
import com.grengcry.model.entity.*;
import com.grengcry.model.enums.OrderStatus;
import com.grengcry.repository.OrderRepository;
import com.grengcry.repository.ProductRepository;
import com.grengcry.repository.UserRepository;
import com.grengcry.util.EntityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    public PagedResponse<OrderResponse> getOrders(OrderStatus status, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Order> orderPage = (status != null) ?
            orderRepository.findByStatus(status, pageable) :
            orderRepository.findAll(pageable);
        
        List<OrderResponse> orders = orderPage.getContent().stream()
            .map(EntityMapper::toOrderResponse)
            .collect(Collectors.toList());
            
        return new PagedResponse<>(orders, orderPage.getTotalElements(), page, orderPage.getTotalPages());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found", "id", id));
        return EntityMapper.toOrderResponse(order);
    }

    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found", "id", userId));

        Order order = new Order();
        order.setUser(user);
        
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderProductRequest productRequest : request.getProducts()) {
            Product product = productRepository.findById(productRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found", "id", productRequest.getProductId()));
            
            if (product.getStock() < productRequest.getQuantity()) {
                throw new BadRequestException("Not enough stock for product: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(productRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItems.add(orderItem);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(productRequest.getQuantity())));
            
            product.setStock(product.getStock() - productRequest.getQuantity());
            productRepository.save(product);
        }

        order.setItems(orderItems);
        order.setTotal(total);
        order.setStatus(OrderStatus.PENDING);
        
        Order savedOrder = orderRepository.save(order);
        return EntityMapper.toOrderResponse(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found", "id", orderId));
        order.setStatus(request.getStatus());
        Order updatedOrder = orderRepository.save(order);
        return EntityMapper.toOrderResponse(updatedOrder);
    }
}