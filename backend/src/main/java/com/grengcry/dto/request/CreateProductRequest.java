package com.grengcry.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateProductRequest {
    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private Integer stock;
}