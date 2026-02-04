package com.travelmate.dto;

import com.travelmate.service.matching.MatchingService.UserScore;
import java.util.List;

public class MatchResponse {
    private List<UserScore> users;
    private List<GroupMatchDto> groups;

    public MatchResponse(List<UserScore> users, List<GroupMatchDto> groups) {
        this.users = users;
        this.groups = groups;
    }

    // Getters
    public List<UserScore> getUsers() { return users; }
    public List<GroupMatchDto> getGroups() { return groups; }
}