# ---------- Build stage ----------
# CHANGE: Use JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom first (dependency caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source
COPY src ./src

# Build executable JAR
RUN mvn clean package -DskipTests

# ---------- Runtime stage ----------
# CHANGE: Use JRE 17
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/travel-matching-backend-jar-with-dependencies.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"]`