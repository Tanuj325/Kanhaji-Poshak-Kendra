package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.analytics.*;
import com.tanuj.krishanaposhak.repository.UserRepository;
import com.tanuj.krishanaposhak.service.CustomerAnalyticsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Objects;

/**
 * Implementation of customer analytics service.
 */
@Service
public class CustomerAnalyticsServiceImpl implements CustomerAnalyticsService {

    private final UserRepository userRepository;

    public CustomerAnalyticsServiceImpl(UserRepository userRepository) {
        this.userRepository = Objects.requireNonNull(userRepository);
    }

    @Override
    public CustomerOverviewDTO getOverview() {
        Long totalCustomers = userRepository.count();
        Long verifiedCustomers = userRepository.countByEmailVerified(true);
        Long unverifiedCustomers = totalCustomers - verifiedCustomers;
        Long customersWithOrders = userRepository.countUsersWithAtLeastOneOrder();
        Long customersWithoutOrders = totalCustomers - customersWithOrders;
        Long repeatCustomers = userRepository.countUsersWithMoreThanOneOrder();
        Double averageOrdersPerUser = userRepository.averageOrdersPerUser();
        Double averageTotalSpentPerUser = userRepository.averageTotalSpentPerUser();

        // Calculate new customers today, this week, this month
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfThisWeek = now.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).toLocalDate().atStartOfDay();
        LocalDateTime startOfThisMonth = now.toLocalDate().withDayOfMonth(1).atStartOfDay();

        Long newCustomersToday = userRepository.countByCreatedAtBetween(startOfToday, now);
        Long newCustomersThisWeek = userRepository.countByCreatedAtBetween(startOfThisWeek, now);
        Long newCustomersThisMonth = userRepository.countByCreatedAtBetween(startOfThisMonth, now);

        return new CustomerOverviewDTO(
                totalCustomers,
                customersWithOrders, // activeCustomers defined as those with at least one order
                newCustomersToday,
                newCustomersThisWeek,
                newCustomersThisMonth,
                verifiedCustomers,
                unverifiedCustomers,
                customersWithOrders,
                customersWithoutOrders,
                repeatCustomers,
                averageOrdersPerUser,
                averageTotalSpentPerUser
        );
    }

    @Override
    public Page<UserSummaryDTO> getNewUsers(Pageable pageable) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return userRepository.findNewUsers(sevenDaysAgo, pageable);
    }

    @Override
    public Page<UserSummaryDTO> getRepeatCustomers(Pageable pageable) {
        return userRepository.findRepeatUsers(pageable);
    }

    @Override
    public Page<UserSummaryDTO> getInactiveUsers(Pageable pageable) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return userRepository.findInactiveUsers(thirtyDaysAgo, pageable);
    }

    @Override
    public Page<UserSummaryDTO> getRecentUsers(Pageable pageable) {
        return userRepository.findRecentUsers(pageable);
    }

    @Override
    public Page<TopSpenderDTO> getTopSpenders(Pageable pageable) {
        return Page.empty(pageable);
    }
}