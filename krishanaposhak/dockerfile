# ==========================================
# Stage 1: Build the application with Maven
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy pom.xml first for Docker layer caching
COPY pom.xml ./

# Download dependencies (cached layer if pom.xml unchanged)
RUN mvn dependency:go-offline -B

# Copy source code and build the production jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# Stage 2: Run the application (lightweight)
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root user to run the app (security best practice)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy only the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Default Spring Boot production port (can be overridden by SERVER_PORT env var)
EXPOSE 8080

# JVM options can be tuned via JAVA_OPTS env var at runtime
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]