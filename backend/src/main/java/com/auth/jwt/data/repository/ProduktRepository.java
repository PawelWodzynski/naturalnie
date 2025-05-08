package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.Produkt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduktRepository extends JpaRepository<Produkt, Long>, PagingAndSortingRepository<Produkt, Long> {

    // Fetch all necessary associations to prevent LazyInitializationException in ProduktDTO
    @Query(value = "SELECT p FROM Produkt p " +
           "LEFT JOIN FETCH p.rodzajProduktu " +
           "LEFT JOIN FETCH p.jednostka " +
           "LEFT JOIN FETCH p.nadkategoria " +
           "LEFT JOIN FETCH p.opakowanie " +
           "LEFT JOIN FETCH p.stawkaVat " +
           "WHERE p.nadkategoria.id = :nadkategoriaId",
           countQuery = "SELECT COUNT(p) FROM Produkt p WHERE p.nadkategoria.id = :nadkategoriaId")
    Page<Produkt> findByNadkategoria_IdWithAssociations(@Param("nadkategoriaId") Long nadkategoriaId, Pageable pageable);

    // Override findAll to fetch associations for the generic paginated endpoint
    @Query(value = "SELECT p FROM Produkt p " +
           "LEFT JOIN FETCH p.rodzajProduktu " +
           "LEFT JOIN FETCH p.jednostka " +
           "LEFT JOIN FETCH p.nadkategoria " +
           "LEFT JOIN FETCH p.opakowanie " +
           "LEFT JOIN FETCH p.stawkaVat",
           countQuery = "SELECT COUNT(p) FROM Produkt p")
    @Override
    Page<Produkt> findAll(Pageable pageable);
}

