package com.seikyuuressha.aptfeemanagement.repository;

import com.seikyuuressha.aptfeemanagement.entity.Contracts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<Contracts, String> {
}
