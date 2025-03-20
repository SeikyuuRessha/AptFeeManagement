package com.example.javaframework.repository;

import com.example.javaframework.entity.Residents;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResidentsRepository extends JpaRepository<Residents, String> {
}
