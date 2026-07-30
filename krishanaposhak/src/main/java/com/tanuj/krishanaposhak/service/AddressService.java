package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.address.AddressRequest;
import com.tanuj.krishanaposhak.dto.address.AddressResponse;

import java.util.List;

public interface AddressService {

    List<AddressResponse> getAddressesByUser(Long userId);

    AddressResponse getAddressById(Long userId, Long addressId);

    AddressResponse addAddress(Long userId, AddressRequest request);

    AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request);

    void deleteAddress(Long userId, Long addressId);

    AddressResponse setDefaultAddress(Long userId, Long addressId);

}