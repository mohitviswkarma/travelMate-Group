package com.travelmate.controller.profile; // Make sure this matches your folder!

import com.travelmate.entity.enums.Gender;
import com.travelmate.entity.enums.Language;
import com.travelmate.entity.enums.PreferredCompanionGender;
import java.util.List;

/**
 * This is the DTO. It must have the EXACT same field names 
 * as the JSON you send from the frontend.
 */
public class UpdateUser {

    private Short age;
    private Gender gender;
    private PreferredCompanionGender preferredTravelCompanionGender;
    private String bio;
    private List<String> interests;
    private Integer budgetMin;
    private Integer budgetMax;
    private String hometown;
    private String currentOccupation;
    private List<Language> travelLanguages;
    private String profilePhotoUrl;
    private Boolean profileCompleted;

    // Empty constructor for Gson
    public UpdateUser() {}

    // --- GETTERS AND SETTERS ---
    // Note: If you have red lines here, make sure the types (Gender, etc.) are imported above.

    public Short getAge() { return age; }
    public void setAge(Short age) { this.age = age; }

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public PreferredCompanionGender getPreferredTravelCompanionGender() { return preferredTravelCompanionGender; }
    public void setPreferredTravelCompanionGender(PreferredCompanionGender preferredTravelCompanionGender) { this.preferredTravelCompanionGender = preferredTravelCompanionGender; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }

    public Integer getBudgetMin() { return budgetMin; }
    public void setBudgetMin(Integer budgetMin) { this.budgetMin = budgetMin; }

    public Integer getBudgetMax() { return budgetMax; }
    public void setBudgetMax(Integer budgetMax) { this.budgetMax = budgetMax; }

    public String getHometown() { return hometown; }
    public void setHometown(String hometown) { this.hometown = hometown; }

    public String getCurrentOccupation() { return currentOccupation; }
    public void setCurrentOccupation(String currentOccupation) { this.currentOccupation = currentOccupation; }

    public List<Language> getTravelLanguages() { return travelLanguages; }


    public void setTravelLanguages(List<Language> travelLanguages) { this.travelLanguages = travelLanguages; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public Boolean getProfileCompleted() { return profileCompleted; }
    public void setProfileCompleted(Boolean profileCompleted) { this.profileCompleted = profileCompleted; }
}