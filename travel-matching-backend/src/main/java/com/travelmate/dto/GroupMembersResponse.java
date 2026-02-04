package com.travelmate.dto;

import java.util.List;

public class GroupMembersResponse {

    private String groupId;
    private String groupName;
    private List<UserSummaryDto> members;
    private int memberCount;

    public GroupMembersResponse(String groupId, String groupName, List<UserSummaryDto> members, int memberCount) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.members = members;
        this.memberCount = memberCount;
    }

    // Getters
    public String getGroupId() {
        return groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public List<UserSummaryDto> getMembers() {
        return members;
    }

    public int getMemberCount() {
        return memberCount;
    }
}