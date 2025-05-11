#!/bin/sh

REQUIRED_SUCCESS_COUNT=5
RETRY_INTERVAL=3
CURRENT_SUCCESS=0
MAX_TOTAL_RETRIES=30  # limit prób, by nie wisieć w nieskończoność
TOTAL_TRIES=0

echo "Oczekiwanie na bazę danych MySQL – wymagane $REQUIRED_SUCCESS_COUNT udanych prób z rzędu..."

while [ $CURRENT_SUCCESS -lt $REQUIRED_SUCCESS_COUNT ] && [ $TOTAL_TRIES -lt $MAX_TOTAL_RETRIES ]; do
  if mysql -h db -P 3306 -u root -ppassword -e "SELECT 1;" > /dev/null 2>&1; then
    CURRENT_SUCCESS=$((CURRENT_SUCCESS + 1))
    echo "✔️  Sukces $CURRENT_SUCCESS/$REQUIRED_SUCCESS_COUNT"
  else
    echo "❌  Baza niedostępna – resetuję licznik sukcesów."
    CURRENT_SUCCESS=0
  fi

  TOTAL_TRIES=$((TOTAL_TRIES + 1))
  sleep $RETRY_INTERVAL
done

if [ $CURRENT_SUCCESS -eq $REQUIRED_SUCCESS_COUNT ]; then
  echo "✅ Baza danych stabilnie dostępna. Uruchamiam backend."
  exec java -jar app.jar
else
  echo "⛔ Nie udało się osiągnąć $REQUIRED_SUCCESS_COUNT sukcesów z rzędu. Kończę."
  exit 1
fi
