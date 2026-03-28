package com.travelmate.config;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;
import com.travelmate.entity.UserProfile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class GsonConfig {

    // 1. Create a single, static instance accessible from anywhere
    private static final Gson gson = createGson();

    // 2. Public accessor
    public static Gson getGson() {
        return gson;
    }

    private static Gson createGson() {
        return new GsonBuilder()
                .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .setPrettyPrinting()
                .serializeNulls()
                // --- INFINITE LOOP FIX ---
                .setExclusionStrategies(new ExclusionStrategy() {
                    @Override
                    public boolean shouldSkipField(FieldAttributes f) {
                        // Skip 'user' field inside 'UserProfile' to break the loop
                        return f.getDeclaringClass() == UserProfile.class && f.getName().equals("user");
                    }

                    @Override
                    public boolean shouldSkipClass(Class<?> clazz) {
                        return false;
                    }
                })
                // -------------------------
                .create();
    }

    // --- Adapters (Keep these as they were) ---
    private static class LocalDateAdapter extends TypeAdapter<LocalDate> {
        @Override
        public void write(JsonWriter out, LocalDate value) throws IOException {
            if (value == null) { out.nullValue(); } else { out.value(value.toString()); }
        }
        @Override
        public LocalDate read(JsonReader in) throws IOException {
            if (in.peek() == JsonToken.NULL) { in.nextNull(); return null; }
            return LocalDate.parse(in.nextString());
        }
    }

    private static class LocalDateTimeAdapter extends TypeAdapter<LocalDateTime> {
        @Override
        public void write(JsonWriter out, LocalDateTime value) throws IOException {
            if (value == null) { out.nullValue(); } else { out.value(value.toString()); }
        }
        @Override
        public LocalDateTime read(JsonReader in) throws IOException {
            if (in.peek() == JsonToken.NULL) { in.nextNull(); return null; }
            return LocalDateTime.parse(in.nextString());
        }
    }
}