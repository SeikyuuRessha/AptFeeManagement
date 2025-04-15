package com.seikyuuressha.aptfeemanagement.repository;

import com.seikyuuressha.aptfeemanagement.entity.Residents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResidentsRepository extends JpaRepository<Residents, String> {
    Optional<Residents> findByEmail(String email);
}
