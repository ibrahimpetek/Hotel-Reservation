package com.example.hotel_reservation_be.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import com.iyzipay.Options;


@Configuration 
public class IyzicoConfig {

     @Bean
    public Options iyzicoOptions(
            @Value("${iyzico.api-key}") String apiKey,
            @Value("${iyzico.secret-key}") String secretKey,
            @Value("${iyzico.base-url}") String baseUrl
    ) {
        Options options = new Options();
        options.setApiKey(apiKey);
        options.setSecretKey(secretKey);
        options.setBaseUrl(baseUrl);
        return options;
    }
    
}
