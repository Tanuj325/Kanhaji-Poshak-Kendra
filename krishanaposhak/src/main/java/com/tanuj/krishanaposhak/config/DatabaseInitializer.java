package com.tanuj.krishanaposhak.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

@Component
@Slf4j
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final DataSource dataSource;

    @Override
    public void run(String... args) {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            // Drop legacy unique constraints on cart_items table if they exist
            // This prevents HTTP 409 Conflict when adding multiple colors of the same variant to cart.
            dropIndexIfExists(stmt, "cart_items", "uk_cart_variant");
            dropIndexIfExists(stmt, "cart_items", "uk_cart_item_variant");

        } catch (Exception e) {
            log.warn("Database initialization check encountered an issue: {}", e.getMessage());
        }
    }

    private void dropIndexIfExists(Statement stmt, String tableName, String indexName) {
        try {
            stmt.executeUpdate("ALTER TABLE " + tableName + " DROP INDEX " + indexName);
            log.info("Successfully dropped legacy unique index '{}' from '{}'", indexName, tableName);
        } catch (SQLException e) {
            // Index might not exist in clean/fresh databases, which is expected behavior
            log.debug("Index '{}' on '{}' was not present or already removed: {}", indexName, tableName, e.getMessage());
        }
    }
}
