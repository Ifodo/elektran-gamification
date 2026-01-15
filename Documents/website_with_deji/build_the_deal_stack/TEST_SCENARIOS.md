# Test Scenarios — Build the Deal Stack

This document outlines test scenarios to verify correct scoring, validation logic, and user messaging.

---

## Test Environment Setup

1. Open the application in a browser with Developer Console open
2. Clear Local Storage before each test: `localStorage.clear()`
3. Navigate to `index.html` to start each test

---

## Test Scenario 1: Successful Deal Completion

### Objective
Verify that a properly sequenced deal with all mandatory cards achieves a high Transaction Readiness Score (TRS ≥ 80).

### Test Steps

1. Start transaction assessment from landing page
2. Add all 10 mandatory cards in correct sequence:
   - **Step 1**: Bank Pre-Approval (card_001)
   - **Step 2**: Property Inspection (card_002)
   - **Step 3**: Land Verification at Registry (card_003)
   - **Step 4**: Legal Due Diligence (card_004) ← requires card_003
   - **Step 5**: Property Survey (card_005) ← requires card_003
   - **Step 6**: Purchase Agreement Signing (card_006) ← requires card_004
   - **Step 7**: Initial Deposit Payment (card_007) ← requires card_006
   - **Step 8**: Property Insurance (card_008) ← requires card_001
   - **Step 9**: Final Payment (card_009) ← requires card_007, card_008
   - **Step 10**: Title Registration (card_010) ← requires card_009

3. Optionally add helpful optional cards:
   - Estate Infrastructure Check (card_011)
   - Neighborhood Verification (card_013)
   - Building Structural Assessment (card_014) ← requires card_002

4. Click "Review Deal"

### Expected Results

#### Time Calculation
- Bank Pre-Approval: 5 days
- Property Inspection: 2 days
- Land Verification: 10 days
- Legal Due Diligence: 7 days
- Property Survey: 5 days
- Purchase Agreement: 1 day
- Initial Deposit: 1 day
- Property Insurance: 3 days
- Final Payment: 1 day
- Title Registration: 14 days
- **Total: 49 days** (4 days over 45-day timeline)

If adding optional cards:
- Estate Infrastructure Check: +1 day
- Neighborhood Verification: +2 days
- Building Structural Assessment: +3 days

#### Scoring
- **Completeness Score**: 100/100 (all mandatory cards present)
- **Sequencing Score**: 100/100 (all prerequisites met)
- **Risk Handling Score**: 100/100 (no risky or red herring cards)
- **Time Discipline Score**: ~91/100 (4 days over timeline = -9 points)
- **Total TRS**: ~98/100

#### UI Indicators
- Time Used: 49 / 45 days (red/warning state)
- Risk Level: Low
- Deal Health: ~98%

#### Result Page
- **Score Band**: "High Transaction Readiness"
- **Strengths**:
  - "All mandatory transaction steps completed"
  - "Perfect sequencing of prerequisites"
  - "No risky shortcuts taken"
  - "Strong understanding of legal requirements"
  
- **Gaps**:
  - "Timeline exceeded by 4 days" (if applicable based on time calculation)

- **CTA**: "View Verified Opportunities"
- **Link**: https://igethouse.com/properties

---

## Test Scenario 2: Missing Mandatory Cards

### Objective
Verify that missing critical mandatory cards significantly reduces the TRS and provides appropriate feedback.

### Test Steps

1. Start transaction assessment
2. Add only 5 of 10 mandatory cards:
   - Bank Pre-Approval (card_001)
   - Property Inspection (card_002)
   - Land Verification at Registry (card_003)
   - Purchase Agreement Signing (card_006) ← will fail sequencing check
   - Initial Deposit Payment (card_007)

3. Optionally add some optional cards to inflate the count
4. Click "Review Deal"

### Expected Behavior

#### Pre-Validation Warning
Modal should appear:
```
Assessment Incomplete

You are missing 5 mandatory transaction step(s).

Missing steps include: Legal Due Diligence, Property Survey, Property Insurance, and others.

Submitting now will significantly reduce your assessment results.

Would you like to continue anyway, or return to add more steps?
```

5. Click "OK" to proceed with assessment

### Expected Results

#### Scoring
- **Completeness Score**: 50/100 (5 of 10 mandatory cards)
- **Sequencing Score**: ~40/100 (multiple prerequisite violations)
- **Risk Handling Score**: 100/100 (no risky cards, but doesn't matter)
- **Time Discipline Score**: Variable based on cards selected
- **Total TRS**: ~45-55/100

#### Result Page
- **Score Band**: "Low Transaction Readiness"
- **Strengths**:
  - Minimal, if any (e.g., "Started with financial pre-approval")

- **Gaps**:
  - "Missing 5 of 10 mandatory transaction steps"
  - "Legal Due Diligence not completed"
  - "Property Survey not conducted"
  - "Property Insurance not obtained"
  - "Title Registration not completed"
  - "Critical prerequisites not met"

- **CTA**: "Understand the Deal Process"
- **Link**: https://igethouse.com/buyers-guide

---

## Test Scenario 3: Incorrect Sequencing

### Objective
Verify that violating prerequisite order reduces sequencing score and provides specific feedback.

### Test Steps

1. Start transaction assessment
2. Add all 10 mandatory cards in WRONG order:
   - Title Registration (card_010) ← FIRST (requires card_009)
   - Final Payment (card_009) ← SECOND (requires card_007, card_008)
   - Initial Deposit Payment (card_007) ← THIRD (requires card_006)
   - Purchase Agreement Signing (card_006) ← FOURTH (requires card_004)
   - Legal Due Diligence (card_004) ← FIFTH (requires card_003)
   - Property Survey (card_005) ← SIXTH (requires card_003)
   - Land Verification at Registry (card_003)
   - Property Insurance (card_008) ← EIGHTH (requires card_001)
   - Property Inspection (card_002)
   - Bank Pre-Approval (card_001)

3. Click "Review Deal"

### Expected Results

#### Scoring
- **Completeness Score**: 100/100 (all mandatory cards present)
- **Sequencing Score**: ~30-40/100 (multiple violations)
  - card_010 requires card_009 (violation)
  - card_009 requires card_007 & card_008 (violations)
  - card_007 requires card_006 (violation)
  - card_006 requires card_004 (violation)
  - card_004 requires card_003 (violation)
  - card_005 requires card_003 (violation)
  - card_008 requires card_001 (violation)
  
- **Risk Handling Score**: 100/100 (no risky cards)
- **Time Discipline Score**: ~91/100 (same 49 days)
- **Total TRS**: ~65-70/100

#### Result Page
- **Score Band**: "Moderate Transaction Readiness"
- **Strengths**:
  - "All mandatory transaction steps included"
  - "No risky shortcuts taken"

- **Gaps**:
  - "Critical sequencing errors detected"
  - "Title Registration attempted before payment completion"
  - "Legal Due Diligence performed after agreement signing"
  - "Multiple prerequisite violations"

- **Recommendations**:
  - "Review the correct order of property transaction steps"
  - "Ensure legal verification precedes contractual commitments"

- **CTA**: "See What You Missed"
- **Link**: https://igethouse.com/consultation

---

## Test Scenario 4: Time Overflow (Extreme)

### Objective
Verify that excessive time usage severely impacts the Time Discipline Score.

### Test Steps

1. Start transaction assessment
2. Add all 10 mandatory cards in correct sequence
3. Add ALL optional cards:
   - Estate Infrastructure Check (card_011) - 1 day
   - Environmental Impact Assessment (card_012) - 5 days
   - Neighborhood Verification (card_013) - 2 days
   - Building Structural Assessment (card_014) - 3 days

4. Add time-consuming red herring cards:
   - Interior Design Consultation (card_019) - 4 days
   - Furniture Shopping (card_020) - 2 days
   - Plan Housewarming Party (card_021) - 1 day
   - Social Media Announcement (card_022) - 1 day

5. Click "Review Deal"

### Expected Results

#### Time Calculation
- Mandatory cards total: 49 days
- Optional cards total: 11 days
- Red herring cards total: 8 days
- **Grand Total: 68 days** (23 days over 45-day timeline = 51% overtime)

#### Scoring
- **Completeness Score**: 100/100 (all mandatory cards present)
- **Sequencing Score**: 100/100 (correct order maintained)
- **Risk Handling Score**: ~40/100 (4 red herring cards with penalties: 15+10+12+8 = 45 penalty points)
- **Time Discipline Score**: ~49/100 (23 days over = -51 points)
- **Total TRS**: ~72-75/100

#### UI Indicators
- Time Used: 68 / 45 days (critical warning state)
- Risk Level: Moderate-High
- Deal Health: ~72-75%

#### Result Page
- **Score Band**: "Moderate Transaction Readiness"
- **Strengths**:
  - "All mandatory transaction steps completed"
  - "Correct sequencing maintained"

- **Gaps**:
  - "Timeline exceeded by 23 days (51% over budget)"
  - "Included non-essential activities (interior design, furniture shopping)"
  - "Poor time management and prioritization"
  - "Unnecessary steps added to critical transaction path"

- **Recommendations**:
  - "Focus on essential transaction steps only"
  - "Separate deal-closing activities from post-acquisition tasks"
  - "Improve timeline planning and discipline"

- **CTA**: "See What You Missed"
- **Link**: https://igethouse.com/consultation

---

## Test Scenario 5: Risky Shortcuts

### Objective
Verify that taking risky shortcuts severely penalizes the Risk Handling Score.

### Test Steps

1. Start transaction assessment
2. Add some mandatory cards: Bank Pre-Approval, Property Inspection, Purchase Agreement, Deposit, Final Payment
3. **Skip** Land Verification by adding:
   - Skip Land Verification (card_015) - Penalty: 35 points
4. **Skip** Legal Due Diligence by adding:
   - Skip Legal Due Diligence (card_017) - Penalty: 40 points
5. Add Verbal Agreement Only (card_018) - Penalty: 30 points
6. Click "Review Deal"

### Expected Results

#### Scoring
- **Completeness Score**: ~60/100 (6-7 of 10 mandatory cards, but 2 skipped via shortcuts)
- **Sequencing Score**: Variable
- **Risk Handling Score**: ~5/100 (105 penalty points from risky cards)
- **Time Discipline Score**: High (shortcuts save time: -10 + -7 = -17 days)
- **Total TRS**: ~40-45/100

#### Result Page
- **Score Band**: "Low Transaction Readiness"
- **Strengths**: Minimal or none

- **Gaps**:
  - "Critical legal verification steps skipped"
  - "Land verification not performed (high risk of fraud)"
  - "Legal due diligence bypassed (exposes to legal liabilities)"
  - "Verbal agreements are not legally enforceable"
  - "Severe risk exposure in transaction structure"

- **CTA**: "Understand the Deal Process"
- **Link**: https://igethouse.com/buyers-guide

---

## Validation Checklist

For each test scenario, verify:

### ✓ Scoring Accuracy
- [ ] Completeness score reflects card presence
- [ ] Sequencing score detects prerequisite violations
- [ ] Risk handling score applies penalties correctly
- [ ] Time discipline score calculates timeline adherence
- [ ] Total TRS is weighted average of all scores

### ✓ UI Indicators (game.html)
- [ ] Time Used updates in real-time
- [ ] Risk Level reflects current stack
- [ ] Deal Health shows accurate percentage
- [ ] Stack count updates correctly

### ✓ Result Page Display
- [ ] TRS score displays correctly (0-100)
- [ ] Score band classification is accurate
- [ ] Breakdown shows all 4 metrics
- [ ] Strengths are specific and accurate
- [ ] Gaps identify real issues
- [ ] Recommendations are actionable

### ✓ CTA Behavior
- [ ] TRS ≥ 80 → "View Verified Opportunities"
- [ ] 65 ≤ TRS < 80 → "See What You Missed"
- [ ] TRS < 65 → "Understand the Deal Process"
- [ ] Links point to correct URLs

### ✓ Messaging Tone
- [ ] No game terminology (points, win, levels)
- [ ] Professional, advisory language
- [ ] Non-judgmental feedback
- [ ] Action-oriented guidance

---

## Console Debugging

For each test, check browser console for:
```javascript
// Validation results object
{
  totalScore: number,
  scoreBand: { level: 'high' | 'moderate' | 'low', label: string },
  breakdown: {
    completeness: { score: number, weight: number },
    sequencing: { score: number, weight: number },
    riskHandling: { score: number, weight: number },
    timeDiscipline: { score: number, weight: number }
  },
  validationDetails: { ... },
  strengths: string[],
  gaps: string[],
  recommendations: string[]
}
```

---

## Test Results Log

### Test 1: Successful Deal Completion
- **Date**: _____________
- **TRS Score**: _____________
- **Score Band**: _____________
- **Pass/Fail**: _____________
- **Notes**: _____________________________________________

### Test 2: Missing Mandatory Cards
- **Date**: _____________
- **TRS Score**: _____________
- **Score Band**: _____________
- **Pass/Fail**: _____________
- **Notes**: _____________________________________________

### Test 3: Incorrect Sequencing
- **Date**: _____________
- **TRS Score**: _____________
- **Score Band**: _____________
- **Pass/Fail**: _____________
- **Notes**: _____________________________________________

### Test 4: Time Overflow
- **Date**: _____________
- **TRS Score**: _____________
- **Score Band**: _____________
- **Pass/Fail**: _____________
- **Notes**: _____________________________________________

### Test 5: Risky Shortcuts
- **Date**: _____________
- **TRS Score**: _____________
- **Score Band**: _____________
- **Pass/Fail**: _____________
- **Notes**: _____________________________________________

---

**Document Version**: 1.0  
**Last Updated**: January 14, 2026
