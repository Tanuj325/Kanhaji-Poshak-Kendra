package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.analytics.SalesDataDto;
import com.tanuj.krishanaposhak.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service implementation for sales analytics.
 */
@Service
@RequiredArgsConstructor
public class SalesAnalyticsServiceImpl implements com.tanuj.krishanaposhak.service.SalesAnalyticsService {

    private final OrderRepository orderRepository;

    /**
     * Get daily sales data for the last 7 days (including today).
     * Each data point represents a day with label in format "dd MMM".
     *
     * @return list of sales data for the last 7 days
     */
    @Override
    @Transactional(readOnly = true)
    public List<SalesDataDto> getDailySales() {
        LocalDateTime end = LocalDateTime.now().plusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime start = end.minusDays(7);

        List<Object[]> rawData = orderRepository.findSalesDataByDay(start, end);
        Map<LocalDate, SalesDataDto> dataMap = rawData.stream()
                .collect(Collectors.toMap(
                        obj -> LocalDate.of(((Number) obj[0]).intValue(), ((Number) obj[1]).intValue(), ((Number) obj[2]).intValue()),
                        obj -> new SalesDataDto(
                                formatDayLabel(((Number) obj[0]).intValue(), ((Number) obj[1]).intValue(), ((Number) obj[2]).intValue()),
                                ((Number) obj[3]).doubleValue(),
                                ((Number) obj[4]).longValue()
                        )
                ));

        List<SalesDataDto> result = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDateTime.now().minusDays(i).toLocalDate();
            SalesDataDto dto = dataMap.get(date);
            if (dto == null) {
                dto = new SalesDataDto(formatDayLabel(date.getYear(), date.getMonthValue(), date.getDayOfMonth()), 0.0, 0L);
            }
            result.add(dto);
        }
        return result;
    }

    private String formatDayLabel(int year, int month, int day) {
        return String.format("%02d %s", day, Month.of(month).toString().substring(0, 3));
    }

    /**
     * Get weekly sales data for the last 7 weeks (including current week).
     * Each data point represents a week with label in format "Week w".
     *
     * @return list of sales data for the last 7 weeks
     */
    @Override
    @Transactional(readOnly = true)
    public List<SalesDataDto> getWeeklySales() {
        // We'll get data for the last 7 weeks (49 days)
        LocalDateTime end = LocalDateTime.now().plusWeeks(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime start = end.minusWeeks(7);

        List<Object[]> rawData = orderRepository.findSalesDataByWeek(start, end);
        Map<String, SalesDataDto> dataMap = rawData.stream()
                .collect(Collectors.toMap(
                        obj -> "Y" + ((Number) obj[0]).intValue() + "W" + String.format("%02d", ((Number) obj[1]).intValue()),
                        obj -> new SalesDataDto(
                                "Week " + ((Number) obj[1]).intValue(),
                                ((Number) obj[2]).doubleValue(),
                                ((Number) obj[3]).longValue()
                        )
                ));

        List<SalesDataDto> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime weekStart = now.minusWeeks(i).with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY))
                    .withHour(0).withMinute(0).withSecond(0).withNano(0);
            int year = weekStart.getYear();
            int week = weekStart.get(java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR);
            String key = "Y" + year + "W" + String.format("%02d", week);
            SalesDataDto dto = dataMap.get(key);
            if (dto == null) {
                dto = new SalesDataDto("Week " + week, 0.0, 0L);
            }
            result.add(dto);
        }
        return result;
    }

    /**
     * Get monthly sales data for the last 12 months (including current month).
     * Each data point represents a month with label in format "MMM yyyy".
     *
     * @return list of sales data for the last 12 months
     */
    @Override
    @Transactional(readOnly = true)
    public List<SalesDataDto> getMonthlySales() {
        LocalDateTime end = LocalDateTime.now().plusMonths(1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime start = end.minusMonths(12);

        List<Object[]> rawData = orderRepository.findSalesDataByMonth(start, end);
        Map<String, SalesDataDto> dataMap = rawData.stream()
                .collect(Collectors.toMap(
                        obj -> "Y" + ((Number) obj[0]).intValue() + "M" + String.format("%02d", ((Number) obj[1]).intValue()),
                        obj -> new SalesDataDto(
                                Month.of(((Number) obj[1]).intValue()).name().substring(0, 3) + " " + ((Number) obj[0]).intValue(),
                                ((Number) obj[2]).doubleValue(),
                                ((Number) obj[3]).longValue()
                        )
                ));

        List<SalesDataDto> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 11; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            int year = monthStart.getYear();
            int month = monthStart.getMonthValue();
            String key = "Y" + year + "M" + String.format("%02d", month);
            SalesDataDto dto = dataMap.get(key);
            if (dto == null) {
                dto = new SalesDataDto(Month.of(month).name().substring(0, 3) + " " + year, 0.0, 0L);
            }
            result.add(dto);
        }
        return result;
    }

    /**
     * Get yearly sales data for the last 5 years (including current year).
     * Each data point represents a year with label in format "yyyy".
     *
     * @return list of sales data for the last 5 years
     */
    @Override
    @Transactional(readOnly = true)
    public List<SalesDataDto> getYearlySales() {
        LocalDateTime end = LocalDateTime.now().plusYears(1).withMonth(1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime start = end.minusYears(5);

        List<Object[]> rawData = orderRepository.findSalesDataByYear(start, end);
        Map<Integer, SalesDataDto> dataMap = rawData.stream()
                .collect(Collectors.toMap(
                        obj -> ((Number) obj[0]).intValue(),
                        obj -> new SalesDataDto(
                                String.valueOf(((Number) obj[0]).intValue()),
                                ((Number) obj[1]).doubleValue(),
                                ((Number) obj[2]).longValue()
                        )
                ));

        List<SalesDataDto> result = new ArrayList<>();
        int currentYear = LocalDateTime.now().getYear();
        for (int i = 4; i >= 0; i--) {
            int year = currentYear - i;
            SalesDataDto dto = dataMap.get(year);
            if (dto == null) {
                dto = new SalesDataDto(String.valueOf(year), 0.0, 0L);
            }
            result.add(dto);
        }
        return result;
    }

    /**
     * Get sales data for a custom date range (inclusive of start, exclusive of end).
     * Each data point represents a day with label in format "dd MMM yyyy".
     *
     * @param startDate inclusive start date
     * @param endDate   exclusive end date
     * @return list of sales data for each day in the range
     */
    @Override
    @Transactional(readOnly = true)
    public List<SalesDataDto> getCustomSales(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Invalid date range");
        }

        List<Object[]> rawData = orderRepository.findSalesDataByDay(startDate, endDate);
        Map<LocalDate, SalesDataDto> dataMap = rawData.stream()
                .collect(Collectors.toMap(
                        obj -> LocalDate.of(((Number) obj[0]).intValue(), ((Number) obj[1]).intValue(), ((Number) obj[2]).intValue()),
                        obj -> new SalesDataDto(
                                formatDayLabel(((Number) obj[0]).intValue(), ((Number) obj[1]).intValue(), ((Number) obj[2]).intValue()),
                                ((Number) obj[3]).doubleValue(),
                                ((Number) obj[4]).longValue()
                        )
                ));

        List<SalesDataDto> result = new ArrayList<>();
        LocalDateTime current = startDate;
        while (current.isBefore(endDate)) {
            LocalDate date = current.toLocalDate();
            SalesDataDto dto = dataMap.get(date);
            if (dto == null) {
                dto = new SalesDataDto(formatDayLabel(date.getYear(), date.getMonthValue(), date.getDayOfMonth()), 0.0, 0L);
            }
            result.add(dto);
            current = current.plusDays(1);
        }
        return result;
    }
}