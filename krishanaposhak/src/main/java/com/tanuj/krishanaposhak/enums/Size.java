package com.tanuj.krishanaposhak.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Size {

    SIZE_0("0"),
    SIZE_1("1"),
    SIZE_2("2"),
    SIZE_3("3"),
    SIZE_4("4"),
    SIZE_5("5"),
    SIZE_6("6"),
    SIZE_7("7"),
    SIZE_8("8"),
    SIZE_9("9"),
    SIZE_10("10"),
    SIZE_11("11"),
    SIZE_12("12"),
    CUSTOM("CUSTOM");

    private final String value;

    Size(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Size fromValue(String value) {

        for (Size size : Size.values()) {
            if (size.value.equalsIgnoreCase(value)) {
                return size;
            }
        }

        throw new IllegalArgumentException("Invalid size: " + value);
    }
}