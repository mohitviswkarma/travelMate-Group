package com.travelmate.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.travelmate.entity.enums.Gender;
import com.travelmate.entity.enums.Language;
import com.travelmate.entity.enums.PreferredCompanionGender;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "age")
    private Short age;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_travel_companion_gender")
    private PreferredCompanionGender preferredTravelCompanionGender;

    @Column(name = "bio", length = 500)
    private String bio;

    @ElementCollection
    @CollectionTable(
        name = "user_interests",
        joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "interest")
    private List<String> interests;

    @Column(name = "budget_min")
    private Integer budgetMin;

    @Column(name = "budget_max")
    private Integer budgetMax;

    @Column(name = "hometown", length = 100)
    private String hometown;

    @Column(name = "current_occupation", length = 100)
    private String currentOccupation;

    @ElementCollection(targetClass = Language.class)
    @CollectionTable(
        name = "user_travel_languages",
        joinColumns = @JoinColumn(name = "user_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private List<Language> travelLanguages;

    @Column(name = "profile_photo_url", columnDefinition = "TEXT")
    private String profilePhotoUrl;

    @Column(name = "profile_completed", nullable = false)
    private boolean profileCompleted = false;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UserProfile() {
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- GETTERS AND SETTERS ---

    public UUID getUserId() { 
        return userId; 
    }

    public User getUser() { 
        return user; 
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            this.userId = user.getId();
        }
    }

    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }

    public Short getAge() { 
        return age; 
    }
    
    public void setAge(Short age) { 
        this.age = age; 
    }

    public Gender getGender() { 
        return gender; 
    }
    
    public void setGender(Gender gender) { 
        this.gender = gender; 
    }

    public PreferredCompanionGender getPreferredTravelCompanionGender() { 
        return preferredTravelCompanionGender; 
    }
    
    public void setPreferredTravelCompanionGender(PreferredCompanionGender preferredTravelCompanionGender) { 
        this.preferredTravelCompanionGender = preferredTravelCompanionGender; 
    }

    public String getBio() { 
        return bio; 
    }
    
    public void setBio(String bio) { 
        this.bio = bio; 
    }

    public List<String> getInterests() { 
        return interests; 
    }
    
    public void setInterests(List<String> interests) { 
        this.interests = interests; 
    }
    
    public List<Language> getTravelLanguages() { 
        return travelLanguages; 
    }
    
    public void setTravelLanguages(List<Language> travelLanguages) { 
        this.travelLanguages = travelLanguages; 
    }

    public String getCurrentOccupation() { 
        return currentOccupation; 
    }
    
    public void setCurrentOccupation(String currentOccupation) { 
        this.currentOccupation = currentOccupation; 
    }

    public Integer getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(Integer budgetMin) {
        this.budgetMin = budgetMin;
    }

    public Integer getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(Integer budgetMax) {
        this.budgetMax = budgetMax;
    }

    public String getHometown() {
        return hometown;
    }

    public void setHometown(String hometown) {
        this.hometown = hometown;
    }

    @Transient
    public String getPhoneNumber() {
        return user != null ? user.getMobileNumber() : null;
    }
    
    // ADD THIS: Helper method to get full name from User entity
    @Transient
    public String getFullName() {
        return user != null ? user.getName() : null;
    }

    public String getProfilePhotoUrl() { 
        return profilePhotoUrl; 
    }
    
    public void setProfilePhotoUrl(String profilePhotoUrl) { 
        this.profilePhotoUrl = profilePhotoUrl; 
    }

    public boolean isProfileCompleted() { 
        return profileCompleted; 
    }
    
    public void setProfileCompleted(boolean profileCompleted) { 
        this.profileCompleted = profileCompleted; 
    }

    public LocalDateTime getUpdatedAt() { 
        return updatedAt; 
    }
}