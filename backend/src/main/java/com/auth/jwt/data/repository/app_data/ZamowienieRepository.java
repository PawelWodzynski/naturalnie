package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.Zamowienie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZamowienieRepository extends JpaRepository<Zamowienie, Long> {
    
    /**
     * Find all orders by employee ID
     * 
     * @param employeeId the ID of the employee
     * @return list of orders for the employee
     */
    List<Zamowienie> findByEmployeeId(Long employeeId);
    
    /**
     * Find all orders by completion status
     * 
     * @param zrealizowane the completion status
     * @return list of orders with the specified completion status
     */
    List<Zamowienie> findByZrealizowane(Boolean zrealizowane);
    
    /**
     * Find all orders by employee ID and completion status
     * 
     * @param employeeId the ID of the employee
     * @param zrealizowane the completion status
     * @return list of orders for the employee with the specified completion status
     */
    List<Zamowienie> findByEmployeeIdAndZrealizowane(Long employeeId, Boolean zrealizowane);
}
