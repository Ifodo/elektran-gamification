/**
 * rules.js
 * Transaction validation and scoring engine
 */

const RulesEngine = {
    /**
     * Validate and score the deal stack (scenario-aware)
     * @param {Array} dealStack - Array of card IDs in user's stack
     * @param {string} scenarioId - ID of the active scenario (optional, defaults to current)
     * @returns {Object} - Comprehensive validation report with TRS
     */
    validateDealStack(dealStack, scenarioId = null) {
        // Get scenario information
        if (!scenarioId) {
            scenarioId = StateManager.getActiveScenarioId();
        }
        
        const scenario = ScenarioManager.getScenarioById(scenarioId);
        if (!scenario) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        
        const cardPool = scenario.cardPool;
        
        // Initialize validation report
        const validationReport = {
            scenarioId: scenarioId,
            scenarioTitle: scenario.title,
            scenarioDifficulty: scenario.difficulty,
            totalScore: 0,
            scoreBand: null,
            breakdown: {
                completeness: { score: 0, maxScore: 30, details: '', data: {} },
                sequencing: { score: 0, maxScore: 25, details: '', data: {} },
                riskHandling: { score: 0, maxScore: 25, details: '', data: {} },
                timeDiscipline: { score: 0, maxScore: 20, details: '', data: {} }
            },
            validation: {
                missingMandatory: [],
                sequenceViolations: [],
                riskyCards: [],
                redHerringCards: [],
                isComplete: false,
                hasSequenceErrors: false,
                isOnTime: false
            },
            strengths: [],
            gaps: [],
            recommendations: [],
            isValid: false
        };

        // Get all cards from stack using scenario card pool
        const stackCards = dealStack.map(cardId => 
            cardPool.find(card => card.id === cardId)
        ).filter(card => card !== undefined);

        // 1. Check for missing mandatory cards (scenario-aware)
        const missingCards = this.checkMandatoryCards(stackCards, cardPool);
        validationReport.validation.missingMandatory = missingCards;

        // 2. Validate sequencing and prerequisites
        const sequenceValidation = this.validateSequencing(stackCards, dealStack);
        validationReport.validation.sequenceViolations = sequenceValidation.violations;
        validationReport.validation.hasSequenceErrors = sequenceValidation.violations.length > 0;

        // 3. Identify risky and red herring cards
        const riskyCards = stackCards.filter(c => c.category === 'risky');
        const redHerringCards = stackCards.filter(c => c.category === 'red_herring');
        validationReport.validation.riskyCards = riskyCards.map(c => c.name);
        validationReport.validation.redHerringCards = redHerringCards.map(c => c.name);

        // 4. Evaluate Completeness (30%) - scenario-aware
        const completenessResult = this.evaluateCompleteness(stackCards, cardPool);
        validationReport.breakdown.completeness = completenessResult;
        validationReport.validation.isComplete = completenessResult.completionRate === 100;

        // 5. Evaluate Sequencing (25%)
        const sequencingResult = this.evaluateSequencing(stackCards);
        validationReport.breakdown.sequencing = sequencingResult;

        // 6. Evaluate Risk Handling (25%)
        const riskResult = this.evaluateRiskHandling(stackCards);
        validationReport.breakdown.riskHandling = riskResult;

        // 7. Evaluate Time Discipline (20%) - scenario-aware
        const timeResult = this.evaluateTimeDiscipline(stackCards, scenario.timelineDays);
        validationReport.breakdown.timeDiscipline = timeResult;
        validationReport.validation.isOnTime = timeResult.totalDays <= timeResult.timelineDays;

        // 8. Calculate Transaction Readiness Score (TRS)
        validationReport.totalScore = Math.max(0, Math.round(
            completenessResult.score +
            sequencingResult.score +
            riskResult.score +
            timeResult.score
        ));

        // 9. Determine score band
        validationReport.scoreBand = this.getScoreBand(validationReport.totalScore);

        // 10. Identify strengths and gaps
        validationReport.strengths = this.identifyStrengths(validationReport.breakdown, validationReport.validation);
        validationReport.gaps = this.identifyGaps(validationReport.breakdown, validationReport.validation);

        // 11. Generate recommendations
        validationReport.recommendations = this.generateRecommendations(validationReport);

        // 12. Mark as valid
        validationReport.isValid = true;

        return validationReport;
    },

    /**
     * Check for missing mandatory cards (scenario-aware)
     * @param {Array} stackCards - Cards in the stack
     * @param {Array} cardPool - Scenario-specific card pool
     * @returns {Array} - List of missing mandatory cards
     */
    checkMandatoryCards(stackCards, cardPool) {
        const mandatoryCards = cardPool.filter(card => card.category === 'mandatory');
        const stackCardIds = stackCards.map(c => c.id);
        
        const missing = mandatoryCards.filter(mc => !stackCardIds.includes(mc.id));
        
        return missing.map(card => ({
            id: card.id,
            name: card.name,
            timeDays: card.timeDays,
            cost: card.cost
        }));
    },

    /**
     * Validate sequencing and check for prerequisite violations
     * @param {Array} stackCards - Cards in the stack
     * @param {Array} dealStack - Card IDs in order
     * @returns {Object} - Sequence validation results
     */
    validateSequencing(stackCards, dealStack) {
        const violations = [];
        
        stackCards.forEach((card, index) => {
            if (card.prerequisites && card.prerequisites.length > 0) {
                card.prerequisites.forEach(prereqId => {
                    const prereqIndex = dealStack.indexOf(prereqId);
                    
                    if (prereqIndex === -1) {
                        // Prerequisite not in stack
                        const prereqCard = TRANSACTION_CARDS.find(c => c.id === prereqId);
                        violations.push({
                            card: card.name,
                            issue: 'Missing prerequisite',
                            prerequisite: prereqCard ? prereqCard.name : prereqId,
                            severity: 'high'
                        });
                    } else if (prereqIndex >= index) {
                        // Prerequisite comes after current card
                        const prereqCard = TRANSACTION_CARDS.find(c => c.id === prereqId);
                        violations.push({
                            card: card.name,
                            issue: 'Incorrect order',
                            prerequisite: prereqCard ? prereqCard.name : prereqId,
                            severity: 'high',
                            message: `${card.name} requires ${prereqCard.name} to be completed first`
                        });
                    }
                });
            }
        });
        
        return {
            violations,
            hasViolations: violations.length > 0,
            violationCount: violations.length
        };
    },

    /**
     * Evaluate stack completeness (scenario-aware)
     * @param {Array} stackCards - Cards in the stack
     * @param {Array} cardPool - Scenario-specific card pool
     */
    evaluateCompleteness(stackCards, cardPool) {
        const mandatoryCards = cardPool.filter(card => card.category === 'mandatory');
        const mandatoryInStack = stackCards.filter(card => card.category === 'mandatory');
        
        const completionRate = mandatoryInStack.length / mandatoryCards.length;
        const score = Math.round(completionRate * 30);

        const missing = mandatoryCards.filter(mc => 
            !stackCards.find(sc => sc.id === mc.id)
        );

        let details = `Included ${mandatoryInStack.length} of ${mandatoryCards.length} required steps.`;
        if (missing.length > 0) {
            details += ` Missing: ${missing.map(c => c.name).join(', ')}.`;
        }

        return {
            score,
            maxScore: 30,
            details,
            completionRate: Math.round(completionRate * 100),
            data: {
                totalMandatory: mandatoryCards.length,
                includedMandatory: mandatoryInStack.length,
                missingCount: missing.length,
                missingCards: missing.map(c => c.name)
            }
        };
    },

    /**
     * Evaluate sequence correctness
     */
    evaluateSequencing(stackCards) {
        const mandatoryInStack = stackCards.filter(card => card.category === 'mandatory');

        let correctSequences = 0;
        let totalSequences = 0;

        mandatoryInStack.forEach((card, index) => {
            // Check prerequisites
            if (card.prerequisites && card.prerequisites.length > 0) {
                totalSequences++;
                const prerequisitesMet = card.prerequisites.every(prereqId => {
                    const prereqIndex = stackCards.findIndex(c => c.id === prereqId);
                    return prereqIndex !== -1 && prereqIndex < index;
                });
                if (prerequisitesMet) {
                    correctSequences++;
                }
            }
        });

        const sequenceRate = totalSequences > 0 ? correctSequences / totalSequences : 1;
        const score = Math.round(sequenceRate * 25);

        const details = totalSequences > 0 
            ? `${Math.round(sequenceRate * 100)}% of prerequisite dependencies were correctly met.`
            : 'All steps placed without dependency violations.';

        return {
            score,
            maxScore: 25,
            details,
            sequenceRate: Math.round(sequenceRate * 100),
            data: {
                totalDependencies: totalSequences,
                correctDependencies: correctSequences,
                violationCount: totalSequences - correctSequences
            }
        };
    },

    /**
     * Evaluate risk handling
     */
    evaluateRiskHandling(stackCards) {
        const riskyCards = stackCards.filter(card => card.category === 'risky');
        const redHerringCards = stackCards.filter(card => card.category === 'red_herring');
        
        let penalties = 0;
        riskyCards.forEach(card => {
            penalties += card.penalties || 0;
        });
        redHerringCards.forEach(card => {
            penalties += card.penalties || 0;
        });

        const score = Math.max(0, 25 - penalties);

        let details = '';
        if (riskyCards.length === 0 && redHerringCards.length === 0) {
            details = 'No risky shortcuts or irrelevant steps included.';
        } else {
            details = `Included ${riskyCards.length} risky shortcut(s) and ${redHerringCards.length} irrelevant step(s). Penalty: ${penalties} points.`;
        }

        return {
            score,
            maxScore: 25,
            details,
            riskyCount: riskyCards.length,
            redHerringCount: redHerringCards.length,
            data: {
                totalPenalties: penalties,
                riskyCards: riskyCards.map(c => ({ name: c.name, penalty: c.penalties })),
                redHerringCards: redHerringCards.map(c => ({ name: c.name, penalty: c.penalties }))
            }
        };
    },

    /**
     * Evaluate time discipline (scenario-aware)
     * @param {Array} stackCards - Cards in the stack
     * @param {number} timelineDays - Scenario-specific timeline in days
     */
    evaluateTimeDiscipline(stackCards, timelineDays) {
        const totalTimeRequired = stackCards.reduce((sum, card) => {
            return sum + (card.timeDays || 0);
        }, 0);

        const timeRatio = totalTimeRequired / timelineDays;

        let score = 20;
        let details = '';
        let status = '';

        if (timeRatio <= 0.9) {
            // Excellent - within timeline with buffer
            score = 20;
            status = 'Excellent';
            details = `Estimated ${totalTimeRequired} days, well within ${timelineDays}-day timeline.`;
        } else if (timeRatio <= 1.0) {
            // Good - just within timeline
            score = 18;
            status = 'Good';
            details = `Estimated ${totalTimeRequired} days, meeting ${timelineDays}-day timeline.`;
        } else if (timeRatio <= 1.2) {
            // Moderate - slightly over
            score = 12;
            status = 'Over Timeline';
            details = `Estimated ${totalTimeRequired} days, exceeds ${timelineDays}-day timeline by ${Math.round((timeRatio - 1) * 100)}%.`;
        } else {
            // Poor - significantly over
            score = 5;
            status = 'Significantly Over';
            details = `Estimated ${totalTimeRequired} days, significantly exceeds ${timelineDays}-day timeline.`;
        }

        return {
            score,
            maxScore: 20,
            details,
            totalDays: totalTimeRequired,
            timelineDays: timelineDays,
            data: {
                timeRatio: Math.round(timeRatio * 100) / 100,
                bufferDays: timelineDays - totalTimeRequired,
                status: status
            }
        };
    },

    /**
     * Identify strengths from breakdown and validation
     * Advisory tone: Recognize what the user did well
     */
    identifyStrengths(breakdown, validation) {
        const strengths = [];

        // Completeness strengths
        if (breakdown.completeness.score >= 27) {
            strengths.push('You demonstrated thorough understanding by including most required transaction steps');
        } else if (breakdown.completeness.score >= 20) {
            strengths.push('You identified several key mandatory steps in the transaction process');
        }

        // Sequencing strengths
        if (breakdown.sequencing.score >= 20) {
            strengths.push('You showed strong capability in organizing steps with proper prerequisites and logical flow');
        } else if (breakdown.sequencing.score >= 15) {
            strengths.push('You recognized important dependencies between transaction steps');
        }

        // Risk handling strengths
        if (breakdown.riskHandling.score >= 20) {
            strengths.push('You exercised excellent judgment by avoiding shortcuts that could compromise the deal');
        } else if (breakdown.riskHandling.score >= 15) {
            strengths.push('You maintained focus on verified processes without excessive risk-taking');
        }

        // Time discipline strengths
        if (breakdown.timeDiscipline.score >= 16) {
            strengths.push('You demonstrated realistic timeline planning within the deal constraints');
        } else if (breakdown.timeDiscipline.score >= 12) {
            strengths.push('You considered time requirements when structuring the transaction');
        }
        
        // Specific achievements
        if (validation.isComplete) {
            strengths.push('You successfully included all mandatory steps required for transaction completion');
        }
        
        if (!validation.hasSequenceErrors && breakdown.sequencing.score >= 10) {
            strengths.push('You maintained proper step sequencing with correct prerequisite handling');
        }
        
        if (validation.riskyCards.length === 0 && validation.redHerringCards.length === 0) {
            strengths.push('You maintained a disciplined approach focused on essential transaction steps');
        }

        // Always acknowledge engagement
        if (strengths.length === 0) {
            strengths.push('You engaged with the transaction process and demonstrated interest in property acquisition');
            strengths.push('Your assessment provides a baseline for targeted skill development');
        }

        return strengths;
    },

    /**
     * Identify development areas from breakdown and validation
     * Advisory tone: Frame gaps as opportunities for growth with specific guidance
     */
    identifyGaps(breakdown, validation) {
        const gaps = [];

        // Completeness gaps
        if (breakdown.completeness.score < 20) {
            const missingCount = validation.missingMandatory.length;
            if (missingCount > 0) {
                gaps.push(`Consider adding ${missingCount} essential step${missingCount > 1 ? 's' : ''} that strengthen transaction security and compliance`);
                const topMissing = validation.missingMandatory.slice(0, 3).map(c => c.name).join(', ');
                gaps.push(`Priority additions include: ${topMissing}`);
            } else {
                gaps.push('Review the complete list of mandatory steps to ensure comprehensive deal coverage');
            }
        } else if (breakdown.completeness.score < 27) {
            gaps.push('A few additional mandatory steps would complete your transaction framework');
        }

        // Sequencing gaps
        if (breakdown.sequencing.score < 15) {
            if (validation.sequenceViolations.length > 0) {
                gaps.push(`${validation.sequenceViolations.length} step${validation.sequenceViolations.length > 1 ? 's' : ''} could benefit from reordering to respect prerequisite requirements`);
            }
            gaps.push('Understanding step dependencies will help ensure each action builds on properly completed prior work');
        } else if (breakdown.sequencing.score < 20) {
            gaps.push('Fine-tune the sequencing to better align with standard transaction workflows');
        }

        // Risk handling gaps
        if (breakdown.riskHandling.score < 15) {
            if (validation.riskyCards.length > 0) {
                gaps.push('Consider replacing shortcuts with verified processes to protect deal integrity');
                gaps.push(`Specifically review: ${validation.riskyCards.join(', ')}`);
            }
            if (validation.redHerringCards.length > 0) {
                gaps.push('Focus on transaction-critical steps rather than premature planning activities');
            }
        } else if (breakdown.riskHandling.score < 20) {
            gaps.push('Minor adjustments in risk approach would strengthen your transaction structure');
        }

        // Time discipline gaps
        if (breakdown.timeDiscipline.score < 12) {
            const overageDays = breakdown.timeDiscipline.totalDays - breakdown.timeDiscipline.timelineDays;
            if (overageDays > 0) {
                gaps.push(`Current timeline exceeds deadline by ${overageDays} days—consider optimizing or parallelizing steps`);
            }
            gaps.push('Developing realistic timeline awareness will be valuable when managing actual transactions');
        } else if (breakdown.timeDiscipline.score < 16) {
            gaps.push('Refining time estimates will help meet tight transaction deadlines');
        }

        // Provide growth-oriented message if no major gaps
        if (gaps.length === 0) {
            gaps.push('Your foundation is solid—continuing to study real market cases will further sharpen your expertise');
            gaps.push('Consider optional due diligence steps that can strengthen buyer confidence');
        }

        return gaps;
    },

    /**
     * Generate actionable, advisory recommendations
     * Tone: Guidance from a trusted advisor, not criticism
     */
    generateRecommendations(validationReport) {
        const recommendations = [];
        const { validation, breakdown, totalScore } = validationReport;

        // Critical: Essential for transaction integrity
        if (validation.missingMandatory.length > 0) {
            const missing = validation.missingMandatory.slice(0, 3).map(c => c.name).join(', ');
            recommendations.push({
                priority: 'critical',
                category: 'Transaction Completeness',
                message: `We recommend including ${validation.missingMandatory.length} essential step${validation.missingMandatory.length > 1 ? 's' : ''} to ensure deal security: ${missing}${validation.missingMandatory.length > 3 ? ', and others' : ''}`
            });
        }

        if (validation.sequenceViolations.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'Step Sequencing',
                message: `Consider reordering ${validation.sequenceViolations.length} step${validation.sequenceViolations.length > 1 ? 's' : ''} to align with industry-standard prerequisites and dependencies`
            });
        }

        // High: Affects risk profile significantly
        if (validation.riskyCards.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'Risk Mitigation',
                message: `Replace these shortcuts with verified processes for stronger deal protection: ${validation.riskyCards.join(', ')}`
            });
        }

        // Medium: Important for optimization
        if (!validation.isOnTime) {
            const overageDays = breakdown.timeDiscipline.totalDays - breakdown.timeDiscipline.timelineDays;
            recommendations.push({
                priority: 'medium',
                category: 'Timeline Optimization',
                message: `Your current sequence runs ${overageDays} days over deadline. Look for opportunities to parallelize independent steps or streamline the process`
            });
        }

        if (validation.redHerringCards.length > 0) {
            recommendations.push({
                priority: 'medium',
                category: 'Process Focus',
                message: `Consider postponing these steps until after transaction completion: ${validation.redHerringCards.join(', ')}`
            });
        }

        // Advisory: Enhancement opportunities
        if (totalScore >= 65 && totalScore < 80) {
            recommendations.push({
                priority: 'advisory',
                category: 'Enhancement',
                message: 'Your foundation is strong. Adding optional due diligence steps like environmental assessment or structural review could further strengthen buyer confidence'
            });
        }

        if (totalScore >= 80 && breakdown.completeness.score === 30) {
            recommendations.push({
                priority: 'advisory',
                category: 'Market Readiness',
                message: 'You\'re well-prepared for property transactions. Consider engaging with our advisory team to discuss specific properties that match your investment criteria'
            });
        }

        // No major issues - provide growth guidance
        if (recommendations.length === 0) {
            recommendations.push({
                priority: 'advisory',
                category: 'Continuous Learning',
                message: 'Your transaction structure is solid. Continue studying market cases and engaging with transaction professionals to deepen your expertise'
            });
        }

        return recommendations;
    },

    /**
     * Get score band
     */
    getScoreBand(score) {
        if (score >= 80) {
            return {
                level: 'high',
                label: 'High Transaction Readiness',
                color: 'green'
            };
        } else if (score >= 65) {
            return {
                level: 'moderate',
                label: 'Moderate Transaction Readiness',
                color: 'orange'
            };
        } else {
            return {
                level: 'low',
                label: 'Developing Transaction Readiness',
                color: 'red'
            };
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RulesEngine;
}
