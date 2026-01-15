/**
 * result.js
 * Results page logic and score display
 * 
 * Displays Transaction Readiness Score (TRS) with:
 * - Score band-specific feedback (<65, 65-80, >80)
 * - Detailed breakdown of performance
 * - Strengths and development areas
 * - Appropriate call-to-action based on readiness level
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeResultsPage();
});

/**
 * Initialize results page
 * Reads validation results from Local Storage
 * 
 * Edge Cases Handled:
 * - No assessment completed
 * - Corrupted state data
 * - Missing validation results
 * - Page accessed directly without completing assessment
 */
function initializeResultsPage() {
    console.log('Initializing results page...');
    
    // Check Local Storage availability
    if (!StateManager.isStorageAvailable()) {
        showErrorAndRedirect(
            'Your browser\'s Local Storage is not available.\n\n' +
            'This page requires Local Storage to display your assessment results.\n\n' +
            'Please enable Local Storage and complete the assessment again.'
        );
        return;
    }
    
    // Read state from Local Storage
    const state = StateManager.load();

    // Edge Case: No state found (direct access or cleared storage)
    if (!state) {
        console.error('No session state found in Local Storage.');
        showErrorAndRedirect(
            'No assessment found.\n\n' +
            'Please complete the transaction assessment to view your results.'
        );
        return;
    }

    // Edge Case: State exists but no results (assessment not completed)
    if (state.score === null || state.score === undefined) {
        console.error('Assessment not completed. State exists but no score found.');
        showErrorAndRedirect(
            'Assessment incomplete.\n\n' +
            'Please complete and submit your transaction assessment to view results.'
        );
        return;
    }

    // Edge Case: Score exists but breakdown missing (corrupted data)
    if (!state.breakdown) {
        console.error('Assessment data incomplete. Missing breakdown.');
        showErrorAndRedirect(
            'Assessment data is incomplete.\n\n' +
            'Please complete the assessment again to receive your full results.'
        );
        return;
    }

    console.log('Assessment results loaded successfully:', {
        score: state.score,
        completedAt: state.completedAt,
        hasEmail: StateManager.hasEmail()
    });

    // Check if email has been captured
    if (StateManager.hasEmail()) {
        // Show results directly
        console.log('Email already captured. Displaying results...');
        displayResults();
    } else {
        // Show email gate first
        console.log('Email not captured. Showing email gate...');
        showEmailGate();
    }

    // Attach event listeners
    attachEventListeners();
}

/**
 * Show error message and redirect to game page
 */
function showErrorAndRedirect(message) {
    ModalManager.alert('Error', message, 'error');
    setTimeout(() => {
        window.location.href = 'game.html';
    }, 2500);
}

/**
 * Show email gate
 */
function showEmailGate() {
    document.getElementById('emailGate').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
}

/**
 * Display scenario context
 * Shows which scenario was assessed
 */
function displayScenarioContext(scenario) {
    if (!scenario) return;
    
    const contextContainer = document.getElementById('scenarioContext');
    if (!contextContainer) return;
    
    const difficultyClass = `difficulty-${scenario.difficulty}`;
    const difficultyEmoji = scenario.difficulty === 'low' ? '⚡' : 
                           scenario.difficulty === 'medium' ? '⚡⚡' : '⚡⚡⚡';
    
    contextContainer.innerHTML = `
        <div class="scenario-context-banner">
            <span class="scenario-context-icon">${scenario.icon}</span>
            <div class="scenario-context-text">
                <h3 class="scenario-context-title">${scenario.title}</h3>
                <div class="scenario-context-meta">
                    <span class="difficulty-badge ${difficultyClass}">
                        ${difficultyEmoji} ${scenario.difficultyLabel} Difficulty
                    </span>
                    <span class="scenario-context-detail">${scenario.propertyType}</span>
                    <span class="scenario-context-detail">📍 ${scenario.location}</span>
                </div>
            </div>
        </div>
    `;
    
    contextContainer.classList.remove('hidden');
}

/**
 * Display assessment results
 * Reads validation results from Local Storage and renders all components
 */
function displayResults() {
    // Hide email gate, show results
    document.getElementById('emailGate').classList.add('hidden');
    document.getElementById('resultsSection').classList.remove('hidden');

    // Read validation results from Local Storage
    const state = StateManager.load();
    const results = StateManager.getResults();
    
    if (!results || !results.score) {
        console.error('Failed to load results from Local Storage');
        ModalManager.alert(
            'Error Loading Results',
            'Error loading assessment results. Please try again.',
            'error'
        );
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 2000);
        return;
    }

    const score = results.score;
    const breakdown = results.breakdown;

    // Get scenario information
    const scenarioId = state.activeScenarioId || 'residential_basic';
    const scenario = ScenarioManager.getScenarioById(scenarioId);

    console.log('Displaying Transaction Readiness Score (TRS):', score, 'for scenario:', scenario?.title);

    // 0. Display scenario context (NEW)
    displayScenarioContext(scenario);

    // 1. Display TRS Score
    displayTRSScore(score);

    // 2. Display score band classification
    const scoreBand = getScoreBandInfo(score);
    displayScoreBand(scoreBand);

    // 3. Display performance breakdown
    renderBreakdown(breakdown);

    // 4. Get validation report from Local Storage
    let validationReport = state.validationReport;
    if (!validationReport) {
        console.warn('Validation report not found in state. Regenerating...');
        validationReport = RulesEngine.validateDealStack(state.dealStack || [], scenarioId);
    }

    // 5. Display strengths and gaps
    renderStrengthsAndGaps(validationReport.strengths, validationReport.gaps);

    // 6. Display score band-specific feedback and CTA
    renderScoreBandFeedback(scoreBand, score, validationReport);

    console.log('Results displayed successfully:', {
        trs: score,
        scoreBand: scoreBand.label,
        level: scoreBand.level
    });
}

/**
 * Display Transaction Readiness Score (TRS)
 */
function displayTRSScore(score) {
    const scoreValueElement = document.getElementById('scoreValue');
    if (scoreValueElement) {
        scoreValueElement.textContent = score;
    }
}

/**
 * Get score band information based on Transaction Readiness Score (TRS)
 * 
 * Three-tier classification system:
 * 
 * HIGH (80-100):
 * - Label: "High Transaction Readiness"
 * - Feedback: Ready for property acquisition
 * - CTA: "View Verified Opportunities"
 * - Color: Deep Green (Primary)
 * 
 * MODERATE (65-79):
 * - Label: "Moderate Transaction Readiness"
 * - Feedback: Strengthen knowledge with guidance
 * - CTA: "See What You Missed"
 * - Color: Joyful Orange (Accent)
 * 
 * LOW (0-64):
 * - Label: "Developing Transaction Readiness"
 * - Feedback: Build foundation through education
 * - CTA: "Understand the Deal Process"
 * - Color: Terracotta (Secondary)
 * 
 * @param {number} score - TRS from 0-100
 * @returns {Object} Score band information
 */
function getScoreBandInfo(score) {
    if (score >= 80) {
        return {
            level: 'high',
            label: 'High Transaction Readiness',
            range: '80-100',
            color: 'var(--color-primary)',
            description: 'Ready for property acquisition',
            recommendation: 'Proceed with confidence to property selection'
        };
    } else if (score >= 65) {
        return {
            level: 'moderate',
            label: 'Moderate Transaction Readiness',
            range: '65-79',
            color: 'var(--color-accent)',
            description: 'Requires guidance and preparation',
            recommendation: 'Engage advisory support to strengthen capabilities'
        };
    } else {
        return {
            level: 'low',
            label: 'Developing Transaction Readiness',
            range: '0-64',
            color: 'var(--color-secondary)',
            description: 'Needs education and advisory support',
            recommendation: 'Complete educational resources before transacting'
        };
    }
}

/**
 * Display score band classification
 */
function displayScoreBand(scoreBand) {
    const scoreBandElement = document.getElementById('scoreBand');
    if (scoreBandElement) {
        scoreBandElement.textContent = scoreBand.label;
        scoreBandElement.style.color = scoreBand.color;
    }
}

/**
 * Render performance breakdown
 * Shows detailed scoring across four dimensions:
 * - Stack Completeness (30 points)
 * - Sequencing Accuracy (25 points)
 * - Risk Management (25 points)
 * - Time Discipline (20 points)
 */
function renderBreakdown(breakdown) {
    const breakdownGrid = document.getElementById('breakdownGrid');
    
    if (!breakdownGrid) {
        console.warn('Breakdown grid element not found');
        return;
    }

    const items = [
        {
            label: 'Stack Completeness',
            score: breakdown.completeness.score,
            max: breakdown.completeness.maxScore,
            details: breakdown.completeness.details,
            percentage: Math.round((breakdown.completeness.score / breakdown.completeness.maxScore) * 100)
        },
        {
            label: 'Sequencing Accuracy',
            score: breakdown.sequencing.score,
            max: breakdown.sequencing.maxScore,
            details: breakdown.sequencing.details,
            percentage: Math.round((breakdown.sequencing.score / breakdown.sequencing.maxScore) * 100)
        },
        {
            label: 'Risk Management',
            score: breakdown.riskHandling.score,
            max: breakdown.riskHandling.maxScore,
            details: breakdown.riskHandling.details,
            percentage: Math.round((breakdown.riskHandling.score / breakdown.riskHandling.maxScore) * 100)
        },
        {
            label: 'Time Discipline',
            score: breakdown.timeDiscipline.score,
            max: breakdown.timeDiscipline.maxScore,
            details: breakdown.timeDiscipline.details,
            percentage: Math.round((breakdown.timeDiscipline.score / breakdown.timeDiscipline.maxScore) * 100)
        }
    ];

    breakdownGrid.innerHTML = items.map(item => `
        <div class="breakdown-item" title="${item.details}">
            <span class="breakdown-label">${item.label}</span>
            <span class="breakdown-value">${item.score} / ${item.max}</span>
        </div>
    `).join('');
    
    console.log('Breakdown rendered:', items.map(i => `${i.label}: ${i.score}/${i.max}`));
}

/**
 * Render strengths and gaps
 */
function renderStrengthsAndGaps(strengths, gaps) {
    const strengthsList = document.getElementById('strengthsList');
    const gapsList = document.getElementById('gapsList');

    strengthsList.innerHTML = strengths.map(s => `<li>${s}</li>`).join('');
    gapsList.innerHTML = gaps.map(g => `<li>${g}</li>`).join('');
}

/**
 * Render score band-specific feedback and CTA
 * 
 * Three tiers based on Transaction Readiness:
 * - High (≥80): "View Verified Opportunities" - Ready for transactions
 * - Moderate (65-79): "See What You Missed" - Needs guidance
 * - Low (<65): "Understand the Deal Process" - Requires education
 * 
 * CTAs focus on process and readiness, avoiding game terminology
 */
function renderScoreBandFeedback(scoreBand, score, validationReport) {
    const ctaCard = document.getElementById('ctaCard');
    if (!ctaCard) return;

    let ctaContent = '';

    // High Readiness (≥80): Ready for Property Acquisition
    if (scoreBand.level === 'high') {
        ctaContent = `
            <h3 style="color: var(--color-primary); margin-bottom: var(--spacing-lg);">
                ✓ Ready for Property Acquisition
            </h3>
            <p style="margin-bottom: var(--spacing-lg); line-height: var(--line-height-relaxed);">
                Your assessment demonstrates comprehensive understanding of the Nigerian real estate 
                transaction process. You have shown strong capability in deal sequencing, risk management, 
                and process discipline—key indicators of transaction readiness.
            </p>
            <p style="margin-bottom: var(--spacing-xl); color: var(--color-text-muted);">
                You are prepared to navigate property transactions with confidence and make informed 
                investment decisions.
            </p>
            <a href="https://igethouse.ng" 
               target="_blank"
               rel="noopener noreferrer"
               class="btn btn-primary" 
               style="text-decoration: none; display: inline-block;">
                View Verified Opportunities →
            </a>
            <p style="margin-top: var(--spacing-md); text-align: center; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                Visit igetHouse for property visibility
            </p>
            <div style="margin-top: var(--spacing-sm); text-align: center;">
                <button onclick="showWhatsAppContacts()" 
                        style="cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; 
                               padding: 0.625rem 1.25rem; background: #25D366; color: white; border: none;
                               border-radius: 6px; font-size: 0.875rem; font-weight: 500; 
                               transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(37, 211, 102, 0.3);">
                    <span style="font-size: 1.25rem;">💬</span>
                    Chat on WhatsApp
                </button>
            </div>
        `;
    } 
    // Moderate Readiness (65-79): Strengthen Knowledge
    else if (scoreBand.level === 'moderate') {
        ctaContent = `
            <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg);">
                → Strengthen Your Transaction Knowledge
            </h3>
            <p style="margin-bottom: var(--spacing-lg); line-height: var(--line-height-relaxed);">
                Your assessment indicates foundational understanding of property transactions, with specific 
                areas requiring additional attention. You're on the right track, but would benefit from 
                targeted guidance.
            </p>
            <p style="margin-bottom: var(--spacing-md); color: var(--color-text-muted);">
                Our advisory team can provide personalized support to close these knowledge gaps and prepare 
                you for successful deal execution.
            </p>
            ${validationReport.recommendations && validationReport.recommendations.length > 0 ? `
                <div style="background: var(--color-background-alt); padding: var(--spacing-md); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg); text-align: left;">
                    <strong style="color: var(--color-text-primary);">Priority Actions:</strong>
                    <ul style="margin-top: var(--spacing-sm); margin-bottom: 0; padding-left: var(--spacing-lg);">
                        ${validationReport.recommendations.slice(0, 3).map(rec => 
                            `<li style="margin-bottom: var(--spacing-xs); color: var(--color-text-secondary);">${rec.message}</li>`
                        ).join('')}
                    </ul>
                </div>
            ` : ''}
            <a href="https://igethouse.ng" 
               target="_blank"
               rel="noopener noreferrer"
               class="btn btn-primary" 
               style="text-decoration: none; display: inline-block;">
                See What You Missed →
            </a>
            <p style="margin-top: var(--spacing-md); text-align: center; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                Visit igetHouse for property visibility
            </p>
            <div style="margin-top: var(--spacing-sm); text-align: center;">
                <button onclick="showWhatsAppContacts()" 
                        style="cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; 
                               padding: 0.625rem 1.25rem; background: #25D366; color: white; border: none;
                               border-radius: 6px; font-size: 0.875rem; font-weight: 500; 
                               transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(37, 211, 102, 0.3);">
                    <span style="font-size: 1.25rem;">💬</span>
                    Chat on WhatsApp
                </button>
            </div>
        `;
    } 
    // Low Readiness (<65): Build Foundation
    else {
        ctaContent = `
            <h3 style="color: var(--color-secondary); margin-bottom: var(--spacing-lg);">
                ⚠ Build Your Transaction Foundation
            </h3>
            <p style="margin-bottom: var(--spacing-lg); line-height: var(--line-height-relaxed);">
                Your assessment indicates that additional preparation is needed before engaging in property 
                transactions. Successful acquisition requires systematic understanding of the process, 
                documentation, and risk management.
            </p>
            <p style="margin-bottom: var(--spacing-md); color: var(--color-text-muted);">
                We strongly recommend engaging with our educational resources and advisory services to develop 
                the competencies necessary for confident transaction execution.
            </p>
            ${validationReport.validation && validationReport.validation.missingMandatory && validationReport.validation.missingMandatory.length > 0 ? `
                <div style="background: var(--color-background-alt); padding: var(--spacing-md); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg); text-align: left; border-left: 3px solid var(--color-secondary);">
                    <strong style="color: var(--color-text-primary);">Critical Gaps:</strong>
                    <ul style="margin-top: var(--spacing-sm); margin-bottom: 0; padding-left: var(--spacing-lg);">
                        <li style="color: var(--color-text-secondary);">Missing ${validationReport.validation.missingMandatory.length} mandatory transaction steps</li>
                        ${validationReport.validation.sequenceViolations && validationReport.validation.sequenceViolations.length > 0 ? 
                            `<li style="color: var(--color-text-secondary);">${validationReport.validation.sequenceViolations.length} sequencing violations detected</li>` : ''}
                        ${validationReport.validation.riskyCards && validationReport.validation.riskyCards.length > 0 ?
                            `<li style="color: var(--color-text-secondary);">Included risky shortcuts that undermine deal integrity</li>` : ''}
                    </ul>
                </div>
            ` : ''}
            <a href="https://igethouse.ng" 
               target="_blank"
               rel="noopener noreferrer"
               class="btn btn-primary" 
               style="text-decoration: none; display: inline-block;">
                Understand the Deal Process →
            </a>
            <p style="margin-top: var(--spacing-md); text-align: center; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                Visit igetHouse for property visibility
            </p>
            <div style="margin-top: var(--spacing-sm); text-align: center;">
                <button onclick="showWhatsAppContacts()" 
                        style="cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; 
                               padding: 0.625rem 1.25rem; background: #25D366; color: white; border: none;
                               border-radius: 6px; font-size: 0.875rem; font-weight: 500; 
                               transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(37, 211, 102, 0.3);">
                    <span style="font-size: 1.25rem;">💬</span>
                    Chat on WhatsApp
                </button>
            </div>
        `;
    }

    ctaCard.innerHTML = ctaContent;
}

/**
 * Show WhatsApp contacts modal
 */
function showWhatsAppContacts() {
    const modalHTML = `
        <div style="text-align: center;">
            <h3 style="color: var(--color-primary); margin-bottom: var(--spacing-lg); font-size: var(--font-size-xl);">
                💬 Contact Us on WhatsApp
            </h3>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-xl);">
                Choose a contact to start chatting
            </p>
            
            <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                <!-- Miss Smart -->
                <a href="https://wa.me/2349165226722" 
                   target="_blank"
                   rel="noopener noreferrer"
                   style="text-decoration: none; display: flex; align-items: center; justify-content: space-between;
                          padding: var(--spacing-lg); background: var(--color-background-alt); 
                          border: 2px solid var(--color-border); border-radius: var(--border-radius-lg);
                          transition: all 0.2s ease;">
                    <div style="text-align: left;">
                        <div style="font-weight: var(--font-weight-semibold); color: var(--color-text-primary); 
                                    font-size: var(--font-size-lg); margin-bottom: 0.25rem;">
                            Miss Smart
                        </div>
                        <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                            +234 916 522 6722
                        </div>
                    </div>
                    <div style="background: #25D366; color: white; padding: 0.5rem 1rem; 
                                border-radius: 6px; font-size: var(--font-size-sm); font-weight: 500;">
                        <span style="font-size: 1rem;">💬</span> Chat
                    </div>
                </a>
                
                <!-- Olayinka Okunola -->
                <a href="https://wa.me/2348128532038" 
                   target="_blank"
                   rel="noopener noreferrer"
                   style="text-decoration: none; display: flex; align-items: center; justify-content: space-between;
                          padding: var(--spacing-lg); background: var(--color-background-alt); 
                          border: 2px solid var(--color-border); border-radius: var(--border-radius-lg);
                          transition: all 0.2s ease;">
                    <div style="text-align: left;">
                        <div style="font-weight: var(--font-weight-semibold); color: var(--color-text-primary); 
                                    font-size: var(--font-size-lg); margin-bottom: 0.25rem;">
                            Olayinka Okunola
                        </div>
                        <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                            +234 812 853 2038
                        </div>
                    </div>
                    <div style="background: #25D366; color: white; padding: 0.5rem 1rem; 
                                border-radius: 6px; font-size: var(--font-size-sm); font-weight: 500;">
                        <span style="font-size: 1rem;">💬</span> Chat
                    </div>
                </a>
            </div>
        </div>
    `;
    
    // Use the universalModal (correct ID on result.html)
    const modal = document.getElementById('universalModal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        const modalTitle = modal.querySelector('#universalModalTitle');
        const modalMessage = modal.querySelector('#universalModalMessage');
        const modalActions = modal.querySelector('#universalModalActions');
        const modalIcon = modal.querySelector('#universalModalIcon');
        
        // Hide default elements
        if (modalTitle) modalTitle.style.display = 'none';
        if (modalMessage) modalMessage.style.display = 'none';
        if (modalActions) modalActions.style.display = 'none';
        if (modalIcon) modalIcon.style.display = 'none';
        
        // Insert custom content
        if (modalContent) {
            const existingCustomContent = modalContent.querySelector('.whatsapp-contacts-custom');
            if (existingCustomContent) {
                existingCustomContent.remove();
            }
            
            const customDiv = document.createElement('div');
            customDiv.className = 'whatsapp-contacts-custom';
            customDiv.innerHTML = modalHTML;
            modalContent.appendChild(customDiv);
        }
        
        modal.classList.add('active');
        
        // Close on backdrop click
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                const customContent = modal.querySelector('.whatsapp-contacts-custom');
                if (customContent) customContent.remove();
                // Restore default elements
                if (modalTitle) modalTitle.style.display = '';
                if (modalMessage) modalMessage.style.display = '';
                if (modalActions) modalActions.style.display = '';
                if (modalIcon) modalIcon.style.display = '';
            }
        };
    }
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
    // Email form submission
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }

    // Try another scenario button (NEW)
    const tryAnotherBtn = document.getElementById('tryAnotherScenarioBtn');
    if (tryAnotherBtn) {
        tryAnotherBtn.addEventListener('click', handleTryAnotherScenario);
    }

    // Retry button
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', handleRetry);
    }
}

/**
 * Handle email submission
 */
function handleEmailSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();

    if (email && validateEmail(email)) {
        StateManager.saveEmail(email);
        displayResults();
    } else {
        ModalManager.alert(
            'Invalid Email',
            'Please enter a valid email address.',
            'warning'
        );
    }
}

/**
 * Handle try another scenario button click (NEW)
 * Saves current result and redirects to scenario selection
 */
function handleTryAnotherScenario() {
    const state = StateManager.load();
    const currentScenario = state?.activeScenarioId ? 
        ScenarioManager.getScenarioById(state.activeScenarioId) : null;
    
    ModalManager.confirm(
        'Try Another Scenario?',
        `You completed "${currentScenario?.title || 'this scenario'}" with a score of ${state?.score || 0}/100.\n\nYour result will be saved. Ready to try a different property type?`,
        () => {
            // User confirmed - mark scenario as completed and redirect to selection
            console.log('Marking scenario as completed and redirecting to scenario selection...');
            if (state?.activeScenarioId && state?.score !== null) {
                StateManager.completeScenario(state.activeScenarioId, state.score);
            }
            window.location.href = 'index.html';
        },
        () => {
            // User cancelled
            console.log('User cancelled scenario selection');
        },
        { confirmText: 'Choose Scenario', cancelText: 'Stay Here', type: 'info' }
    );
}

/**
 * Handle retry - Start New Deal
 * Clears Local Storage and returns to landing page
 */
function handleRetry() {
    ModalManager.confirm(
        'Start New Deal?',
        'This will clear your current assessment results and return you to the beginning.\n\nDo you want to continue?',
        () => {
            // User confirmed
            console.log('Starting new deal - clearing Local Storage...');
            StateManager.clear();
            console.log('Local Storage cleared. Redirecting to landing page...');
            window.location.href = 'index.html';
        },
        () => {
            // User cancelled
            console.log('User cancelled starting new deal');
        },
        { confirmText: 'Start New Deal', cancelText: 'Cancel', type: 'warning' }
    );
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Get score band color (legacy function for compatibility)
 */
function getScoreBandColor(level) {
    const colors = {
        'high': 'var(--color-primary)',
        'moderate': 'var(--color-accent)',
        'low': 'var(--color-secondary)'
    };
    return colors[level] || 'var(--color-text-secondary)';
}

/**
 * Get score summary for display
 */
function getScoreSummary(score, validationReport) {
    const scoreBand = getScoreBandInfo(score);
    const summary = {
        score: score,
        band: scoreBand,
        strengths: validationReport.strengths || [],
        gaps: validationReport.gaps || [],
        recommendations: validationReport.recommendations || [],
        validation: validationReport.validation || {}
    };
    
    return summary;
}

// Make showWhatsAppContacts globally accessible
window.showWhatsAppContacts = showWhatsAppContacts;
