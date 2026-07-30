package com.tanuj.krishanaposhak.exception;

public class BadRequestException extends RuntimeException{

    public BadRequestException(String message){
        super(message);
    }

}