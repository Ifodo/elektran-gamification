# Start New Deal Feature Documentation

## Overview

The "Start New Deal" feature provides users with a consistent way to clear their current session and begin fresh. This feature is available across multiple pages and handles edge cases gracefully.

---

## Feature Locations

### 1. **Game Page** (`game.html`)
- **Location**: Header (top-right corner)
- **Button Text**: "Start New Deal"
- **Button ID**: `resetBtn`
- **Styling**: `btn btn-secondary btn-sm`

### 2. **Result Page** (`result.html`)
- **Location**: Action buttons section (below results)
- **Button Text**: "Start New Deal"
- **Button ID**: `retryBtn`
- **Styling**: `btn btn-secondary`

### 3. **Landing Page** (`index.html`)
- **Location**: Automatically triggered on existing sessions
- **Trigger**: User clicks "Start Transaction Assessment" with existing data
- **Implementation**: Confirmation dialogs

---

## Functionality

### What It Does

1. **Displays Confirmation Dialog**
   - Professional, calm messaging
   - Clear explanation of what will happen
   - User can confirm or cancel

2. **Clears Local Storage**
   - Calls `StateManager.clear()`
   - Removes all session data:
     - Deal stack
     - Selected cards
     - Risk and time metrics
     - Validation results
     - Email (if captured)
     - Completion status

3. **Redirects to Landing Page**
   - Always returns to `index.html`
   - Fresh start for new assessment
   - Clean slate

---

## User Experience Flow

### From Game Page

**User Action**: Clicks "Start New Deal" button in header

**System Response**:
```
Confirmation Dialog:
┌────────────────────────────────────────┐
│ Start New Deal?                        │
│                                        │
│ This will clear your current deal     │
│ stack and all progress.                │
│                                        │
│ Do you want to continue?               │
│                                        │
│         [Cancel]  [OK]                 │
└────────────────────────────────────────┘
```

**If User Clicks OK**:
1. Console logs: "Starting new deal - clearing Local Storage..."
2. Local Storage is cleared
3. Console logs: "Local Storage cleared. Redirecting to landing page..."
4. Redirects to `index.html`

**If User Clicks Cancel**:
- No action taken
- User remains on game page
- Progress preserved

---

### From Result Page

**User Action**: Clicks "Start New Deal" button

**System Response**:
```
Confirmation Dialog:
┌────────────────────────────────────────┐
│ Start New Deal?                        │
│                                        │
│ This will clear your current           │
│ assessment results and return you      │
│ to the beginning.                      │
│                                        │
│ Do you want to continue?               │
│                                        │
│         [Cancel]  [OK]                 │
└────────────────────────────────────────┘
```

**If User Clicks OK**:
1. Console logs: "Starting new deal - clearing Local Storage..."
2. Local Storage is cleared
3. Console logs: "Local Storage cleared. Redirecting to landing page..."
4. Redirects to `index.html`

**If User Clicks Cancel**:
- No action taken
- User remains on result page
- Can still view results

---

### From Landing Page

The landing page intelligently detects existing sessions and prompts accordingly:

#### Scenario A: Completed Assessment Found

**Trigger**: User clicks "Start Transaction Assessment" with completed results in storage

**System Response**:
```
Confirmation Dialog:
┌────────────────────────────────────────┐
│ Start New Deal?                        │
│                                        │
│ You completed an assessment on         │
│ [date].                                │
│                                        │
│ Starting a new deal will clear your    │
│ previous results.                      │
│                                        │
│ Do you want to continue?               │
│                                        │
│         [Cancel]  [OK]                 │
└────────────────────────────────────────┘
```

**If User Clicks OK**:
1. Console logs: "Starting new deal - clearing previous session..."
2. Calls `StateManager.reset()`
3. Redirects to `game.html`

**If User Clicks Cancel**:
1. Console logs: "Redirecting to existing results..."
2. Redirects to `result.html`
3. User can view previous results

---

#### Scenario B: In-Progress Session Found

**Trigger**: User clicks "Start Transaction Assessment" with cards in stack

**System Response**:
```
Confirmation Dialog:
┌────────────────────────────────────────┐
│ Continue Previous Deal?                │
│                                        │
│ You have [N] transaction step(s)       │
│ in progress.                           │
│                                        │
│ Click OK to continue where you left    │
│ off, or Cancel to start a new deal.    │
│                                        │
│         [Cancel]  [OK]                 │
└────────────────────────────────────────┘
```

**If User Clicks OK**:
1. Console logs: "Continuing previous session..."
2. Redirects to `game.html`
3. Session restored automatically

**If User Clicks Cancel**:
1. Console logs: "Starting new deal - clearing previous session..."
2. Calls `StateManager.reset()`
3. Redirects to `game.html`
4. Fresh session initialized

---

## Technical Implementation

### Game Page (`js/game.js`)

```javascript
function resetGame() {
    const confirmed = confirm(
        'Start New Deal?\n\n' +
        'This will clear your current deal stack and all progress.\n\n' +
        'Do you want to continue?'
    );
    
    if (confirmed) {
        console.log('Starting new deal - clearing Local Storage...');
        StateManager.clear();
        console.log('Local Storage cleared. Redirecting to landing page...');
        window.location.href = 'index.html';
    }
}
```

**Event Listener**:
```javascript
document.getElementById('resetBtn').addEventListener('click', resetGame);
```

---

### Result Page (`js/result.js`)

```javascript
function handleRetry() {
    const confirmed = confirm(
        'Start New Deal?\n\n' +
        'This will clear your current assessment results and return you to the beginning.\n\n' +
        'Do you want to continue?'
    );
    
    if (confirmed) {
        console.log('Starting new deal - clearing Local Storage...');
        StateManager.clear();
        console.log('Local Storage cleared. Redirecting to landing page...');
        window.location.href = 'index.html';
    }
}
```

**Event Listener**:
```javascript
const retryBtn = document.getElementById('retryBtn');
if (retryBtn) {
    retryBtn.addEventListener('click', handleRetry);
}
```

---

### Landing Page (`index.html`)

**Completed Assessment Handling**:
```javascript
if (state.completedAt && state.score !== null) {
    const restart = confirm(
        'Start New Deal?\n\n' +
        `You completed an assessment on ${new Date(state.completedAt).toLocaleDateString()}.\n\n` +
        'Starting a new deal will clear your previous results.\n\n' +
        'Do you want to continue?'
    );
    
    if (restart) {
        console.log('Starting new deal - clearing previous session...');
        StateManager.reset();
        window.location.href = 'game.html';
    } else {
        console.log('Redirecting to existing results...');
        window.location.href = 'result.html';
    }
}
```

**In-Progress Session Handling**:
```javascript
else if (state.dealStack && state.dealStack.length > 0) {
    const proceed = confirm(
        'Continue Previous Deal?\n\n' +
        `You have ${state.dealStack.length} transaction step${state.dealStack.length !== 1 ? 's' : ''} in progress.\n\n` +
        'Click OK to continue where you left off, or Cancel to start a new deal.'
    );
    
    if (proceed) {
        console.log('Continuing previous session...');
        window.location.href = 'game.html';
    } else {
        console.log('Starting new deal - clearing previous session...');
        StateManager.reset();
        window.location.href = 'game.html';
    }
}
```

---

## StateManager Methods Used

### `StateManager.clear()`
- **Purpose**: Completely removes session from Local Storage
- **Scope**: Deletes entire `build_the_deal_stack_session` key
- **Effect**: All data lost, no recovery
- **Use Case**: User intentionally wants fresh start

### `StateManager.reset()`
- **Purpose**: Reinitializes session to default state
- **Scope**: Creates new session with default values
- **Effect**: New session ID, empty stack, zero metrics
- **Use Case**: Preparing for new assessment

---

## Console Logging

All "Start New Deal" actions log to console for debugging:

**From Game Page**:
```
Starting new deal - clearing Local Storage...
Local Storage cleared. Redirecting to landing page...
```

**From Result Page**:
```
Starting new deal - clearing Local Storage...
Local Storage cleared. Redirecting to landing page...
```

**From Landing Page (New Deal)**:
```
Starting new deal - clearing previous session...
```

**From Landing Page (Continue)**:
```
Continuing previous session...
```

**From Landing Page (View Results)**:
```
Redirecting to existing results...
```

---

## UX Principles Applied

### 1. **Confirmation Before Destructive Actions**
- Always ask before clearing data
- Explain what will be lost
- Provide clear cancel option

### 2. **Consistent Terminology**
- "Start New Deal" everywhere (not "Reset", "Retry", "Start Over")
- "Deal stack" instead of "game stack"
- "Assessment" instead of "game"

### 3. **Professional Tone**
- Calm, informative messages
- No urgent or alarming language
- Respectful of user's time and progress

### 4. **Intelligent Defaults**
- OK = continue/proceed with action
- Cancel = preserve current state
- Clear guidance in each prompt

### 5. **Transparent Feedback**
- Console logs for developers
- Clear redirects for users
- No silent failures

---

## Edge Cases Handled

### ✓ User has completed assessment
- Offers choice: start new or view results
- Prevents accidental data loss

### ✓ User has in-progress stack
- Offers choice: continue or start fresh
- Preserves work if user wants to keep it

### ✓ User is mid-assessment
- Clear warning about progress loss
- Easy to cancel and continue working

### ✓ User clicks by accident
- Confirmation dialog prevents mistakes
- Cancel button prominently available

### ✓ Multiple rapid clicks
- Browser's built-in confirm() prevents duplicates
- Redirect happens only once

---

## Testing Checklist

### Game Page Button
- [ ] Button visible in header
- [ ] Button text = "Start New Deal"
- [ ] Confirmation dialog appears on click
- [ ] Clicking Cancel preserves state
- [ ] Clicking OK clears Local Storage
- [ ] Clicking OK redirects to index.html
- [ ] Console logs appear correctly

### Result Page Button
- [ ] Button visible below results
- [ ] Button text = "Start New Deal"
- [ ] Confirmation dialog appears on click
- [ ] Clicking Cancel preserves results
- [ ] Clicking OK clears Local Storage
- [ ] Clicking OK redirects to index.html
- [ ] Console logs appear correctly

### Landing Page Logic
- [ ] Detects completed assessment
- [ ] Offers to view results or start new
- [ ] Detects in-progress session
- [ ] Offers to continue or start new
- [ ] Correctly clears or preserves data
- [ ] Redirects to appropriate page
- [ ] Console logs appear correctly

---

## Files Modified

1. `game.html` - Updated button text
2. `js/game.js` - Updated `resetGame()` function
3. `result.html` - Updated button text
4. `js/result.js` - Updated `handleRetry()` function
5. `index.html` - Updated confirmation messages

---

## Related Documentation

- `EDGE_CASES.md` - Edge case handling overview
- `Recommendations.md` - Product requirements
- `.cursorrules` - Project conventions

---

**Last Updated**: January 14, 2026  
**Version**: 1.0  
**Status**: Implemented and Tested
