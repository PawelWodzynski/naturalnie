package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.Zdjecie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ZdjecieRepository extends JpaRepository<Zdjecie, Integer> {
    List<Zdjecie> findByProduktId(Integer produktId);
    Optional<Zdjecie> findByUrlAndProdukt_Id(String url, Integer produktId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Zdjecie z WHERE z.produkt.id = :produktId AND z.id NOT IN :ids")
    void deleteByProduktIdAndIdNotIn(@Param("produktId") Integer produktId, @Param("ids") List<Integer> ids);

    // Added for SkladnikService to find by name, if needed for Zdjecie (e.g. by alt text or similar)
    // Optional<Zdjecie> findByNazwa(String nazwa); // Example, if Zdjecie had a 'nazwa' or 'altText' field for lookup
}

