package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.address.AddressRequest;
import com.tanuj.krishanaposhak.dto.address.AddressResponse;
import com.tanuj.krishanaposhak.entity.Address;
import com.tanuj.krishanaposhak.entity.User;
import com.tanuj.krishanaposhak.exception.ForbiddenException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.AddressMapper;
import com.tanuj.krishanaposhak.repository.AddressRepository;
import com.tanuj.krishanaposhak.repository.UserRepository;
import com.tanuj.krishanaposhak.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getAddressesByUser(Long userId) {
        return addressMapper.toResponseList(addressRepository.findByUserId(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getAddressById(Long userId, Long addressId) {
        return addressMapper.toResponse(findOwnedAddressOrThrow(userId, addressId));
    }

    @Override
    public AddressResponse addAddress(Long userId, AddressRequest request) {

        User user = userRepository.getReferenceById(userId);

        Address address = addressMapper.toEntity(request);
        address.setUser(user);

        if (request.isDefaultAddress()) {
            clearExistingDefault(userId);
        } else if (!addressRepository.existsByUserId(userId)) {
            // First address for the user automatically becomes the default.
            address.setDefaultAddress(true);
        }

        address = addressRepository.save(address);
        return addressMapper.toResponse(address);
    }

    @Override
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {

        Address address = findOwnedAddressOrThrow(userId, addressId);
        addressMapper.updateEntityFromRequest(request, address);

        if (request.isDefaultAddress()) {
            clearExistingDefault(userId);
            address.setDefaultAddress(true);
        }

        address = addressRepository.save(address);
        return addressMapper.toResponse(address);
    }

    @Override
    public void deleteAddress(Long userId, Long addressId) {
        Address address = findOwnedAddressOrThrow(userId, addressId);
        addressRepository.delete(address);
    }

    @Override
    public AddressResponse setDefaultAddress(Long userId, Long addressId) {
        Address address = findOwnedAddressOrThrow(userId, addressId);
        clearExistingDefault(userId);
        address.setDefaultAddress(true);
        address = addressRepository.save(address);
        return addressMapper.toResponse(address);
    }

    private Address findOwnedAddressOrThrow(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have access to this address");
        }
        return address;
    }

    private void clearExistingDefault(Long userId) {
        addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                .ifPresent(existingDefault -> {
                    existingDefault.setDefaultAddress(false);
                    addressRepository.save(existingDefault);
                });
    }

}