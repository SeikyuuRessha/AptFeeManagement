package com.seikyuuressha.aptfeemanagement.configuration;

import com.seikyuuressha.aptfeemanagement.constant.PredefinedRole;
import com.seikyuuressha.aptfeemanagement.entity.Residents;
import com.seikyuuressha.aptfeemanagement.repository.ResidentsRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.microsoft.sqlserver.jdbc.SQLServerDriver")
    ApplicationRunner applicationRunner(ResidentsRepository residentsRepository) {
        log.info("Initializing application.....");
        return _ -> {
            if (residentsRepository.findByEmail("hieu.dhm172808@gmail.com").isEmpty()) {
                Residents user = Residents.builder()
                        .email("hieu.dhm172808@gmail.com")
                        .password(passwordEncoder.encode("123456789"))
                        .myRole(PredefinedRole.ADMIN_ROLE)
                        .build();

                residentsRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }
            log.info("Application initialization completed .....");
        };
    }
}
