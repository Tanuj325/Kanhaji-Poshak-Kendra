package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.banner.BannerRequest;
import com.tanuj.krishanaposhak.dto.banner.BannerResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.entity.Banner;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.BannerMapper;
import com.tanuj.krishanaposhak.repository.BannerRepository;
import com.tanuj.krishanaposhak.service.BannerService;
import com.tanuj.krishanaposhak.service.CloudinaryService;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Map;

import com.tanuj.krishanaposhak.util.UrlUtils;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;
    private final BannerMapper bannerMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public List<BannerResponse> getActiveBanners() {
        return bannerRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .map(bannerMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<BannerResponse> getBanners(
            String title,
            Boolean active,
            String sort,
            int page,
            int size) {

        Sort sorting = Sort.by("displayOrder").ascending();

        if ("title".equalsIgnoreCase(sort)) {
            sorting = Sort.by("title").ascending();
        } else if ("createdAt".equalsIgnoreCase(sort)) {
            sorting = Sort.by("createdAt").descending();
        }

        Pageable pageable = PageRequest.of(page, size, sorting);

        Specification<Banner> specification = (root, query, cb) -> {
            java.util.List<Predicate> predicates = new java.util.ArrayList<>();

            if (title != null && !title.trim().isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("title")),
                                "%" + title.toLowerCase() + "%"
                        )
                );
            }

            if (active != null) {
                predicates.add(cb.equal(root.get("active"), active));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Banner> bannerPage = bannerRepository.findAll(specification, pageable);

        List<BannerResponse> content = bannerPage.getContent()
                .stream()
                .map(bannerMapper::toResponse)
                .toList();

        return PaginationResponse.<BannerResponse>builder()
                .content(content)
                .page(bannerPage.getNumber())
                .size(bannerPage.getSize())
                .totalElements(bannerPage.getTotalElements())
                .totalPages(bannerPage.getTotalPages())
                .first(bannerPage.isFirst())
                .last(bannerPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BannerResponse> getAllBanners() {
        return bannerRepository.findAll().stream()
                .map(bannerMapper::toResponse)
                .toList();
    }

    @Override
    public BannerResponse createBanner(BannerRequest request) {
        // Validate file
        MultipartFile file = request.getFile();
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Banner image is required");
        }

        // Upload to Cloudinary
        Map<String, Object> uploadResult = cloudinaryService.upload(file, "krishana-poshak/banners");
        String imageUrl = UrlUtils.ensureHttps(uploadResult.containsKey("secure_url") ? (String) uploadResult.get("secure_url") : (String) uploadResult.get("url"));
        String publicId = (String) uploadResult.get("public_id");

        Banner banner = bannerMapper.toEntity(request);
        banner.setImageUrl(imageUrl);
        banner.setPublicId(publicId);
        if (banner.getDisplayOrder() == null) {
            banner.setDisplayOrder(0);
        }

        banner = bannerRepository.save(banner);
        return bannerMapper.toResponse(banner);
    }

    @Override
    public BannerResponse updateBanner(Long id, BannerRequest request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));

        MultipartFile file = request.getFile();
        if (file != null && !file.isEmpty()) {
            String oldPublicId = banner.getPublicId();

            // Upload new image
            Map<String, Object> uploadResult = cloudinaryService.upload(file, "krishana-poshak/banners");
            String imageUrl = UrlUtils.ensureHttps(uploadResult.containsKey("secure_url") ? (String) uploadResult.get("secure_url") : (String) uploadResult.get("url"));
            String publicId = (String) uploadResult.get("public_id");

            banner.setImageUrl(imageUrl);
            banner.setPublicId(publicId);

            // Delete old image if exists (safely)
            if (oldPublicId != null && !oldPublicId.isBlank()) {
                try {
                    cloudinaryService.delete(oldPublicId);
                } catch (Exception e) {
                    log.warn("Failed to delete old banner image from Cloudinary (publicId: {}): {}", oldPublicId, e.getMessage());
                }
            }
        }

        // Update other fields
        bannerMapper.updateEntity(request, banner);
        if (banner.getDisplayOrder() == null) {
            banner.setDisplayOrder(0);
        }

        banner = bannerRepository.save(banner);
        return bannerMapper.toResponse(banner);
    }

    @Override
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));

        // Delete from Cloudinary
        if (banner.getPublicId() != null) {
            cloudinaryService.delete(banner.getPublicId());
        }

        bannerRepository.delete(banner);
    }

    @Override
    public void toggleBannerStatus(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));
        banner.setActive(!Boolean.TRUE.equals(banner.getActive()));
        banner = bannerRepository.save(banner);
        bannerMapper.toResponse(banner);
    }
}