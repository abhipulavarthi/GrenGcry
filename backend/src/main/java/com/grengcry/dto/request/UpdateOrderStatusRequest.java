package com.grengcry.dto.request;

import com.grengcry.model.enums.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private OrderStatus status;
}