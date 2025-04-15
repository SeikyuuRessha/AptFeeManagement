package com.seikyuuressha.aptfeemanagement.repository;

import com.seikyuuressha.aptfeemanagement.entity.Buildings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingsRepository extends JpaRepository<Buildings, String> {
    boolean existsByBuildingName(String buildingName);
}
