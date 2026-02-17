import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== INTERACTIVE QUIZ COMPONENT ====================
const InteractiveQuiz = ({ question, onAnswer, onSkip, type }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = {
    causality: {
      title: 'THE "CAUSALITY" TEST',
      subtitle: 'Did you get the logic?',
      question: 'Based on the simulation, at what approximate traffic speed did the pollution physically breach the residential windows?',
      options: [
        { id: 'a', text: 'Around 5 MPH (when traffic stopped)', correct: true, feedback: '✓ CORRECT. Slow traffic = particles accumulate and expand vertically into buildings.' },
        { id: 'b', text: 'Around 30 MPH (optimized flow)', correct: false, feedback: '✗ At 30 MPH, particles disperse horizontally. Breach occurs during congestion (5 MPH).' },
        { id: 'c', text: 'Speed didn\'t matter', correct: false, feedback: '✗ The simulation showed speed directly controls vertical expansion. Lower speed → higher breach risk.' },
        { id: 'd', text: 'I\'m not sure', correct: false, feedback: 'The breach warning appeared during the congested state (5 MPH). Rewatch the "BREACH DETECTED" alert.' }
      ],
      goal: 'To validate that the visual link between Speed (5 mph) and Volume (Expansion) was clear.'
    },
    magnitude: {
      title: 'THE "MAGNITUDE" TEST',
      subtitle: 'Did you feel the urgency?',
      question: 'On a scale of 1-10, how "safe" did the optimized state (30 MPH, Cyan) feel compared to the congested state (5 MPH, Red)?',
      options: [
        { id: 'a', text: 'Optimized: 9-10 | Congested: 1-2 (Huge difference)', correct: true, feedback: '✓ CORRECT. The data shows 350% risk increase. You felt the contrast!' },
        { id: 'b', text: 'Optimized: 7-8 | Congested: 4-5 (Moderate difference)', correct: false, feedback: 'The visual contrast should be stark: 26.25 vs 10.50 µg/m³ is a 150% increase. Review the comparison cards.' },
        { id: 'c', text: 'Both felt similar (No strong difference)', correct: false, feedback: '✗ Risk score: 0.90 vs 0.20 is a critical difference. The red/cyan color coding should emphasize this.' },
        { id: 'd', text: 'I didn\'t notice a safety difference', correct: false, feedback: 'The forensic dashboard showed: CONGESTED = TOXIC | OPTIMIZED = SAFE. Revisit Section 4.' }
      ],
      goal: 'To prove that the "Forensic Aesthetic" (dark mode, stark colors) successfully conveyed risk perception.'
    },
    policy: {
      title: 'THE "POLICY" TEST',
      subtitle: 'Did you buy the solution?',
      question: 'If you were a policymaker, would you prioritize "Variable Speed Limits" or "Electric Truck Mandates" based strictly on this video evidence?',
      options: [
        { id: 'a', text: 'Variable Speed Limits (control traffic flow)', correct: true, feedback: '✓ CORRECT. The simulation proves speed changes the pollution plume shape. Flow control addresses the root cause.' },
        { id: 'b', text: 'Electric Truck Mandates (reduce emissions)', correct: false, feedback: 'While EVs help, this evidence specifically shows that SPEED controls particle ACCUMULATION, regardless of fuel type.' },
        { id: 'c', text: 'Both equally', correct: false, feedback: 'The video shows speed is the primary variable. 5 MPH creates vertical expansion even with current trucks.' },
        { id: 'd', text: 'Neither, need more data', correct: false, feedback: 'The forensic analysis establishes a causal link: slow traffic → accumulation → breach. The evidence is conclusive.' }
      ],
      goal: 'To validate that the specific argument—flow/speed controls accumulation—landed with viewers.'
    }
  };

  const currentQuestion = questions[type];

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setShowFeedback(true);

    // Auto-close after showing feedback
    setTimeout(() => {
      if (onAnswer) {
        onAnswer(option.correct, type);
      }
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && onSkip) {
          onSkip();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative max-w-3xl w-full mx-4 border-2 border-cyan-400 bg-black p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 border-b border-cyan-400/30 pb-4">
          <div className="mono-text text-xs text-cyan-400 mb-1 tracking-widest">
            {currentQuestion.title}
          </div>
          <div className="text-sm text-gray-400 italic">
            {currentQuestion.subtitle}
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">
            {currentQuestion.question}
          </h3>
          <div className="mono-text text-xs text-gray-500 mt-4 p-3 bg-gray-900 border-l-2 border-yellow-500">
            <strong className="text-yellow-500">GOAL:</strong> {currentQuestion.goal}
          </div>
        </div>

        {/* Options */}
        {!showFeedback && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 border border-gray-700 hover:border-cyan-400 transition-all mono-text text-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">{option.id.toUpperCase()}.</span>
                  <span className="text-gray-300">{option.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-6 border-2 ${
                selectedAnswer.correct
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : 'border-red-500 bg-red-500/10'
              }`}
            >
              <div className="mono-text text-lg font-bold mb-3">
                {selectedAnswer.correct ? (
                  <span className="text-cyan-400">EVIDENCE UNDERSTOOD</span>
                ) : (
                  <span className="text-red-400">REVIEW EVIDENCE</span>
                )}
              </div>
              <div className="text-gray-300 text-sm leading-relaxed">
                {selectedAnswer.feedback}
              </div>

              {selectedAnswer.correct && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="mt-4 text-center mono-text text-xs text-cyan-400"
                >
                  ✓ FORENSIC NARRATIVE VALIDATED
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip button */}
        {!showFeedback && onSkip && (
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 mono-text text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            [ESC] SKIP
          </button>
        )}

        {/* Progress indicator */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
          <div className="mono-text text-xs text-gray-600">
            QUESTION {type === 'causality' ? '1' : type === 'magnitude' ? '2' : '3'} / 3
          </div>
          {showFeedback && (
            <div className="mono-text text-xs text-gray-500">
              Auto-closing in 4s...
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveQuiz;
