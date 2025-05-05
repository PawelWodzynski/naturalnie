FROM mysql:8.0

# Kopiowanie skryptów SQL
COPY scripts/01-auth-db.sql /docker-entrypoint-initdb.d/
COPY scripts/02-app-data-db.sql /docker-entrypoint-initdb.d/

# Ustawienie uprawnień na skrypty
RUN chmod 644 /docker-entrypoint-initdb.d/*.sql

# Ekspozycja standardowego portu MySQL
EXPOSE 3306
