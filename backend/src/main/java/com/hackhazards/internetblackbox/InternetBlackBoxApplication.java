package com.hackhazards.internetblackbox;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableAsync
@EnableScheduling
@SpringBootApplication
public class InternetBlackBoxApplication {

    public static void main(String[] args) {
        SpringApplication.run(InternetBlackBoxApplication.class, args);
    }
}

