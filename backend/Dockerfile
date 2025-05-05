FROM gradle:jdk21 AS build

WORKDIR /app

# Kopiowanie plików projektu
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./
COPY src ./src

# Budowanie aplikacji
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jdk

WORKDIR /app

# Kopiowanie zbudowanej aplikacji z etapu budowania
COPY --from=build /app/build/libs/*.jar app.jar

# Ekspozycja portu używanego przez aplikację
EXPOSE 8080

# Uruchamianie aplikacji
CMD ["java", "-jar", "app.jar"]
