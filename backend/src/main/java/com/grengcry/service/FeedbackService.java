package com.grengcry.service;

import com.grengcry.dto.request.CreateFeedbackRequest;
import com.grengcry.dto.response.FeedbackResponse;
import com.grengcry.dto.response.PagedResponse;
import com.grengcry.exception.ResourceNotFoundException;
import com.grengcry.model.entity.Feedback;
import com.grengcry.model.entity.Product;
import com.grengcry.model.entity.User;
import com.grengcry.repository.FeedbackRepository;
import com.grengcry.repository.ProductRepository;
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
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public PagedResponse<FeedbackResponse> getFeedbacksForProduct(Long productId, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Feedback> feedbackPage = feedbackRepository.findByProductId(productId, pageable);
        
        List<FeedbackResponse> feedbacks = feedbackPage.getContent().stream()
            .map(EntityMapper::toFeedbackResponse) // Static call to the mapper
            .collect(Collectors.toList());
            
        return new PagedResponse<>(
            feedbacks,
            feedbackPage.getTotalElements(),
            page,
            feedbackPage.getTotalPages()
        );
    }

    @Transactional
    public FeedbackResponse createFeedback(Long productId, Long userId, CreateFeedbackRequest request) {
        // Find the user who is giving the feedback
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found", "id", userId));
        
        // Find the product the feedback is for
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found", "id", productId));

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setProduct(product);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return EntityMapper.toFeedbackResponse(savedFeedback);
    }

    @Transactional
    public void deleteFeedback(Long feedbackId) {
        if (!feedbackRepository.existsById(feedbackId)) {
            throw new ResourceNotFoundException("Feedback not found", "id", feedbackId);
        }
        feedbackRepository.deleteById(feedbackId);
    }
}