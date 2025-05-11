#!/bin/sh

MAX_RETRIES=5
RETRY_INTERVAL=3

echo "Oczekiwanie na dostępność bazy danych MySQL..."

for i in $(seq 1 $MAX_RETRIES); do
  echo "Próba $i/$MAX_RETRIES..."
  if mysql -h db -P 3306 -u root -ppassword -e "SELECT 1;" > /dev/null 2>&1; then
    echo "Baza danych jest dostępna!"
    echo "Uruchamianie aplikacji Spring Boot..."
    exec java -jar app.jar
  fi
  echo "Baza nadal niedostępna. Czekam ${RETRY_INTERVAL}s..."
  sleep $RETRY_INTERVAL
done

echo "Nie udało się połączyć z bazą danych po $MAX_RETRIES próbach. Zamykanie aplikacji."
exit 1
