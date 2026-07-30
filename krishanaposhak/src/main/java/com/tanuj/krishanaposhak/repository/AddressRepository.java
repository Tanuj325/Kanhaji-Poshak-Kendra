package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserId(Long userId);

    Optional<Address> findByUserIdAndDefaultAddressTrue(Long userId);

    boolean existsByUserId(Long userId);

    long countByUserId(Long userId);

    void deleteByUserId(Long userId);

}