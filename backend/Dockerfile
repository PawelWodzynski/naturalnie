# Etap 1: Budowanie aplikacji
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

# Etap 2: Obraz runtime
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Kopiowanie zbudowanej aplikacji z etapu budowania
COPY --from=build /app/build/libs/*.jar app.jar

# Dodanie skryptu startowego
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Instalacja klienta MySQL (do testowania połączenia z bazą)
RUN apt-get update && apt-get install -y default-mysql-client && apt-get clean

# Ekspozycja portu
EXPOSE 8080

# Uruchomienie aplikacji przez skrypt z pętlą oczekującą na bazę
ENTRYPOINT ["./entrypoint.sh"]
