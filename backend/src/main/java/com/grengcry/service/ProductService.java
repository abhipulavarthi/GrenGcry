package com.grengcry.service;

import com.grengcry.dto.request.CreateProductRequest;
import com.grengcry.dto.response.PagedResponse;
import com.grengcry.dto.response.ProductResponse;
import com.grengcry.exception.ResourceNotFoundException;
import com.grengcry.model.entity.Product;
import com.grengcry.repository.ProductRepository;
import com.grengcry.util.EntityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    private final Path fileStorageLocation;

    // Constructor to initialize the file storage location from application.properties
    public ProductService() {
        // NOTE: Make sure you have a property 'file.upload-dir' in your application.properties
        // Example: file.upload-dir=uploads/
        this.fileStorageLocation = Paths.get("uploads/").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public PagedResponse<ProductResponse> getProducts(Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Product> productPage = productRepository.findAll(pageable);
        
        List<ProductResponse> products = productPage.getContent().stream()
            .map(EntityMapper::toProductResponse) // Static call to the mapper
            .collect(Collectors.toList());
            
        return new PagedResponse<>(
            products,
            productPage.getTotalElements(),
            page,
            productPage.getTotalPages()
        );
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found", "id", id));
        return EntityMapper.toProductResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        
        Product savedProduct = productRepository.save(product);
        return EntityMapper.toProductResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found", "id", id));
            
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        
        Product updatedProduct = productRepository.save(product);
        return EntityMapper.toProductResponse(updatedProduct);
    }
    
    @Transactional
    public ProductResponse updateProductImage(Long id, MultipartFile file) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found", "id", id));

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new RuntimeException("File has no name.");
        }
        
        // Generate a unique filename to prevent conflicts
        String fileExtension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i > 0) {
            fileExtension = originalFilename.substring(i);
        }
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        try {
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Set the relative path to be stored in the database
            product.setImage("uploads/" + uniqueFileName);
            
            Product updatedProduct = productRepository.save(product);
            return EntityMapper.toProductResponse(updatedProduct);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + uniqueFileName + ". Please try again!", ex);
        }
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found", "id", id);
        }
        productRepository.deleteById(id);
    }
}