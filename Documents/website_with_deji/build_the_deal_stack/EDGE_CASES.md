# Edge Case Handling — Build the Deal Stack

This document outlines the comprehensive edge case handling implemented across the application to ensure a smooth, professional user experience.

---

## Overview

All edge cases are handled with **clear, calm user feedback** that:
- Uses professional, non-judgmental language
- Provides actionable guidance
- Maintains the advisory tone of the application
- Prevents data loss and confusion

---

## 1. Empty Stack Submission

### Scenario
User clicks "Review Deal" button without adding any transaction steps to their deal stack.

### Handling
- **Location**: `js/game.js` → `validateStack()`
- **Behavior**: Displays a modal with clear guidance
- **Message**:
  ```
  No Transaction Steps Selected
  
  To receive an assessment, please add transaction steps to your deal stack.
  
  Drag cards from the left panel into your deal stack to begin building 
  your transaction sequence.
  ```
- **Action**: User remains on game page, can continue adding cards

---

## 2. Missing Mandatory Cards

### Scenario
User attempts to submit assessment without all required mandatory transaction steps.

### Handling
- **Location**: `js/game.js` → `validateStack()`
- **Behavior**: Shows detailed confirmation dialog with specific missing cards
- **Message**:
  ```
  Assessment Incomplete
  
  You are missing [N] mandatory transaction step(s).
  
  Missing steps include: [card names listed]
  
  Submitting now will significantly reduce your assessment results.
  
  Would you like to continue anyway, or return to add more steps?
  ```
- **Options**:
  - **Cancel**: User returns to add missing steps
  - **Continue**: Proceeds with assessment (reduced score expected)

---

## 3. Page Reload / Refresh Mid-Session

### Scenario
User accidentally refreshes the page or browser crashes during assessment.

### Handling

#### 3a. Detection & Recovery
- **Location**: `js/game.js` → `initializeGame()`
- **Behavior**: 
  - Automatically detects existing session in Local Storage
  - Restores all selected cards and their order
  - Recalculates risk and time indicators
  - Shows subtle notification

#### 3b. Session Restored Notification
- **Type**: Non-intrusive banner (auto-dismisses after 4 seconds)
- **Position**: Top-right corner
- **Message**:
  ```
  Session Restored
  Your [N] transaction step(s) have been recovered.
  ```
- **Design**: Clean, professional, subtle animation

#### 3c. Seamless Recovery
- No data loss
- All drag-and-drop state preserved
- Indicators updated to reflect current state
- User can continue exactly where they left off

---

## 4. Existing Session on Landing Page

### Scenario
User returns to index.html with an existing in-progress or completed session.

### Handling
- **Location**: `index.html` → Start button handler
- **Behaviors**:

#### 4a. Completed Assessment Found
```
Previous Assessment Found

You completed an assessment on [date].

Starting a new assessment will clear your previous results.

Do you want to continue?
```
- **Yes**: Clears state, starts fresh
- **No**: Redirects to `result.html` to view existing results

#### 4b. In-Progress Session Found
```
Continue Previous Session?

You have [N] transaction step(s) in progress.

Would you like to continue where you left off, or start fresh?
```
- **Yes**: Continues existing session
- **No**: Resets and starts new session

---

## 5. Accessing Results Without Completing Assessment

### Scenario
User navigates directly to `result.html` without completing an assessment, or with corrupted data.

### Handling
- **Location**: `js/result.js` → `initializeResultsPage()`
- **Behaviors**:

#### 5a. No Session State
```
No assessment found.

Please complete the transaction assessment to view your results.
```
- **Action**: Redirects to `game.html` after 100ms

#### 5b. State Exists But Not Completed
```
Assessment incomplete.

Please complete and submit your transaction assessment to view results.
```
- **Action**: Redirects to `game.html`

#### 5c. Corrupted Data (Missing Breakdown)
```
Assessment data is incomplete.

Please complete the assessment again to receive your full results.
```
- **Action**: Redirects to `game.html`

---

## 6. Returning to Game After Submission

### Scenario
User navigates back to `game.html` after completing and submitting their assessment.

### Handling
- **Location**: `js/game.js` → `initializeGame()`
- **Behavior**: Detects completed status and redirects
- **Message**:
  ```
  Assessment Already Completed
  
  You have already submitted this assessment.
  
  Redirecting to your results page...
  ```
- **Action**: Automatic redirect to `result.html`

---

## 7. Local Storage Unavailable

### Scenario
User's browser has Local Storage disabled or in private/incognito mode without storage support.

### Handling

#### 7a. On Landing Page
- **Location**: `index.html` → Start button handler
- **Message**:
  ```
  Local Storage Not Available
  
  This application requires Local Storage to save your progress.
  
  Please enable Local Storage in your browser settings and try again.
  ```
- **Action**: User remains on landing page

#### 7b. On Game Page
- **Location**: `js/game.js` → `initializeGame()` → `checkStorageAvailability()`
- **Message**:
  ```
  Storage Not Available
  
  Your browser's Local Storage is not available or disabled.
  
  This assessment requires Local Storage to save your progress.
  
  Please enable Local Storage in your browser settings and refresh the page.
  ```
- **Action**: Assessment cannot proceed

#### 7c. On Results Page
- **Location**: `js/result.js` → `initializeResultsPage()`
- **Message**:
  ```
  Your browser's Local Storage is not available.
  
  This page requires Local Storage to display your assessment results.
  
  Please enable Local Storage and complete the assessment again.
  ```
- **Action**: Redirects to `game.html`

---

## 8. Validation Errors

### Scenario
Unexpected error occurs during rules engine validation.

### Handling
- **Location**: `js/game.js` → `validateStack()` → try/catch block
- **Behavior**:
  - Error is caught and logged to console
  - User-friendly message displayed
  - Validation button is re-enabled (allows retry)
- **Message**:
  ```
  Validation Error
  
  An error occurred while processing your assessment. Please try again.
  ```
- **Action**: User can retry validation

---

## 9. Save Failures

### Scenario
Local Storage quota exceeded or save operation fails.

### Handling
- **Location**: `js/game.js` → `validateStack()`
- **Behavior**: Checks save operation success
- **Message**:
  ```
  Error
  
  Failed to save assessment results. Please try again.
  ```
- **Action**: 
  - Validation button re-enabled
  - User can retry
  - Console logs error details for debugging

---

## 10. Double Submission Prevention

### Scenario
User clicks "Review Deal" button multiple times rapidly.

### Handling
- **Location**: `js/game.js` → `validateStack()`
- **Behavior**:
  - Button disabled immediately on first click
  - Button text changes to "Processing Assessment..."
  - Re-enabled only on error
  - Prevents duplicate validation runs

---

## Summary of User Experience Principles

All edge case handling follows these principles:

1. **Non-Judgmental**: Messages focus on guidance, not blame
2. **Actionable**: Always provide clear next steps
3. **Professional**: Maintain advisory tone throughout
4. **Informative**: Explain what happened and why
5. **Calm**: No urgent or alarming language
6. **Respectful**: Value user's time and progress
7. **Transparent**: Clear about data handling and privacy

---

## Technical Implementation Notes

- All edge cases are logged to console for debugging
- State persistence ensures no data loss on refresh
- Validation is multi-layered (client-side, engine-level)
- Error boundaries prevent cascading failures
- Graceful degradation when features unavailable
- Session restoration is automatic and silent (except notification)

---

**Last Updated**: January 14, 2026  
**Version**: 1.0
