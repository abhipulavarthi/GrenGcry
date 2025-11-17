package com.grengcry.repository;

import com.grengcry.model.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
	Page<Feedback> findByProductId(Long productId, Pageable pageable);
    Page<Feedback> findByRating(Integer rating, Pageable pageable);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getAverageRating();
}
