package com.seikyuuressha.aptfeemanagement.repository;

import com.seikyuuressha.aptfeemanagement.entity.Apartments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartments, String> {
    List<Apartments> findByResidentResidentId(String residentId);
    List<Apartments> findByBuildingBuildingId(String buildingId);
}