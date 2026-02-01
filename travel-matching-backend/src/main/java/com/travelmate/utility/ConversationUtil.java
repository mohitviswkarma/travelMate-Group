package com.travelmate.utility;
import java.util.UUID;

public class ConversationUtil {


    public static String buildConversationId(UUID userA, UUID userB) {
        if (userA.compareTo(userB) < 0) {
            return userA + "_" + userB;
        } else {
            return userB + "_" + userA;
        }
    }

}
