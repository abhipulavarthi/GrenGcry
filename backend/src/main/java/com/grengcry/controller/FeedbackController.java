package com.grengcry.controller;

import com.grengcry.dto.request.CreateFeedbackRequest;
import com.grengcry.dto.response.ApiResponse;
import com.grengcry.dto.response.FeedbackResponse;
import com.grengcry.dto.response.PagedResponse;
import com.grengcry.security.CustomUserDetails; // Make sure this import exists
import com.grengcry.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/{productId}/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // GET /api/products/1/feedbacks
    @GetMapping
    public ResponseEntity<PagedResponse<FeedbackResponse>> getFeedbacksForProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        PagedResponse<FeedbackResponse> response = feedbackService.getFeedbacksForProduct(productId, page, limit);
        return ResponseEntity.ok(response);
    }

    // POST /api/products/1/feedbacks (Authenticated Users Only)
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FeedbackResponse> createFeedback(
            @PathVariable Long productId,
            @AuthenticationPrincipal CustomUserDetails currentUser, // Gets the logged-in user
            @Valid @RequestBody CreateFeedbackRequest request) {
        
        FeedbackResponse newFeedback = feedbackService.createFeedback(productId, currentUser.getId(), request);
        return new ResponseEntity<>(newFeedback, HttpStatus.CREATED);
    }

    // DELETE /api/products/{productId}/feedbacks/{feedbackId} (Admin or Owner Only)
    @DeleteMapping("/{feedbackId}")
    @PreAuthorize("hasRole('ADMIN')") // You can add more complex security later
    public ResponseEntity<ApiResponse<String>> deleteFeedback(@PathVariable Long feedbackId) {
        feedbackService.deleteFeedback(feedbackId);
        return ResponseEntity.ok(ApiResponse.success("Feedback deleted successfully."));
    }
}