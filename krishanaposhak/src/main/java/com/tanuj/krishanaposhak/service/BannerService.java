package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.banner.BannerRequest;
import com.tanuj.krishanaposhak.dto.banner.BannerResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface    BannerService {

    List<BannerResponse> getActiveBanners();

    PaginationResponse<BannerResponse> getBanners(String title, Boolean active, String sort, int page, int size);

    @Transactional(readOnly = true)
    List<BannerResponse> getAllBanners();

    BannerResponse createBanner(BannerRequest request);

    BannerResponse updateBanner(Long id, BannerRequest request);

    void deleteBanner(Long id);

    void toggleBannerStatus(Long id);

}