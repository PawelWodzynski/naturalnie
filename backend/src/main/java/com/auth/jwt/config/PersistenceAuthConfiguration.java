package com.auth.jwt.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@PropertySource({ "classpath:application.properties" })
@EnableTransactionManagement
@Primary
@EnableJpaRepositories(
        basePackages = "com.auth.jwt.data.repository.auth", // repositories for auth schema
        entityManagerFactoryRef = "authEntityManager",
        transactionManagerRef = "authTransactionManager"
)
public class PersistenceAuthConfiguration {

    @Autowired
    private Environment env;

    @Bean
    public LocalContainerEntityManagerFactoryBean authEntityManager() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(authDataSource());
        em.setPackagesToScan("com.auth.jwt.data.entity.auth");      // entities for auth schema
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", env.getProperty("spring.datasource.auth.hibernate.hbm2ddl.auto"));
        properties.put("hibernate.dialect", env.getProperty("spring.datasource.auth.hibernate.dialect"));
        em.setJpaPropertyMap(properties);
        return em;
    }

    @Bean
    public DataSource authDataSource() {
        // HikariCP configuration for Aggregator
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setDriverClassName(env.getProperty("spring.datasource.auth.driver-class-name"));
        hikariConfig.setJdbcUrl(env.getProperty("spring.datasource.auth.url"));
        hikariConfig.setUsername(env.getProperty("spring.datasource.auth.username"));
        hikariConfig.setPassword(env.getProperty("spring.datasource.auth.password"));
        // Additional Hikari settings
        hikariConfig.setMaximumPoolSize(Integer.parseInt(env.getProperty("spring.datasource.hikari.maximum-pool-size", "15")));
        hikariConfig.setConnectionTimeout(Long.parseLong(env.getProperty("spring.datasource.hikari.connection-timeout", "300000")));
        hikariConfig.setIdleTimeout(Long.parseLong(env.getProperty("spring.datasource.hikari.idle-timeout", "60000000")));
        hikariConfig.setMaxLifetime(Long.parseLong(env.getProperty("spring.datasource.hikari.max-lifetime", "18000000")));
        return new HikariDataSource(hikariConfig);
    }

    @Bean
    public PlatformTransactionManager authTransactionManager() {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(authEntityManager().getObject());
        return transactionManager;
    }
}
