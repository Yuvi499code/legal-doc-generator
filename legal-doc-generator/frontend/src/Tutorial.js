import React, { useEffect, useState, useRef } from 'react';
import './Tutorial.css';

const tutorialStepsConfig = [
  {
    id: 'welcome',
    title: 'Welcome!',
    content: "Let's take a quick tour to see how you can generate professional legal documents in just a few clicks.",
    targetId: null,
    position: 'center',
  },
  {
    id: 'select-doc',
    title: '1. Select a Document',
    content: 'Start by choosing the type of document you need. The form below will adapt to your selection.',
    targetId: 'document-type-group',
    position: 'bottom',
  },
  {
    id: 'general-info',
    title: '2. Provide Details',
    content: 'Fill in the required fields. Your input here will populate the placeholders in the document.',
    targetId: 'general-info-grid',
    position: 'right',
  },
  {
    id: 'live-preview',
    title: '3. See a Live Preview',
    content: "The document on the right updates in real-time as you type, so you can see exactly what you're creating.",
    targetId: 'preview-container',
    position: 'left',
  },
  {
    id: 'download-pdf',
    title: '4. Download Your PDF',
    content: 'Once you are satisfied with the preview, you can download a professionally formatted PDF of your document.',
    targetId: 'download-button',
    position: 'top',
  },
  {
    id: 'finish',
    title: "You're All Set!",
    content: "That's everything you need to know. You're ready to create your first document. Click 'Finish' to begin.",
    targetId: null,
    position: 'center',
  },
];

const Tutorial = ({ step, onNext, onPrev, onSkip, totalSteps }) => {
    const [highlightStyle, setHighlightStyle] = useState({ opacity: 0 });
    const [contentStyle, setContentStyle] = useState({ opacity: 0, transform: 'translate(-50%, -50%) scale(0.95)' });
    const contentBoxRef = useRef(null);
  
    const currentStepConfig = tutorialStepsConfig[step];
  
    useEffect(() => {
        if (!currentStepConfig) return;
    
        const { targetId, position } = currentStepConfig;
        
        const updatePosition = () => {
            const targetElement = targetId ? document.getElementById(targetId) : null;
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    
                const scrollTimeout = setTimeout(() => {
                    const targetRect = targetElement.getBoundingClientRect();
                    const padding = 8;
    
                    setHighlightStyle({
                        top: `${targetRect.top - padding}px`,
                        left: `${targetRect.left - padding}px`,
                        width: `${targetRect.width + padding * 2}px`,
                        height: `${targetRect.height + padding * 2}px`,
                        opacity: 1,
                    });
    
                    if (contentBoxRef.current) {
                        const contentRect = contentBoxRef.current.getBoundingClientRect();
                        const isMobile = window.innerWidth < 768;
                        const gap = 15;
    
                        let finalPos = {};
                        const margin = 12; 

                        if (isMobile) {
                            finalPos.left = window.innerWidth / 2 - contentRect.width / 2;
                            const spaceBelow = window.innerHeight - targetRect.bottom - contentRect.height;
                            const spaceAbove = targetRect.top - contentRect.height;

                            if (spaceBelow > gap) { 
                                finalPos.top = targetRect.bottom + gap;
                            } else if (spaceAbove > gap) { 
                                finalPos.top = targetRect.top - contentRect.height - gap;
                            } else { 
                                finalPos.top = window.innerHeight - contentRect.height - margin;
                            }
                        } else {
                            const positions = {
                                top: { top: targetRect.top - contentRect.height - gap, left: targetRect.left + targetRect.width / 2 - contentRect.width / 2 },
                                bottom: { top: targetRect.bottom + gap, left: targetRect.left + targetRect.width / 2 - contentRect.width / 2 },
                                left: { top: targetRect.top + targetRect.height / 2 - contentRect.height / 2, left: targetRect.left - contentRect.width - gap },
                                right: { top: targetRect.top + targetRect.height / 2 - contentRect.height / 2, left: targetRect.right + gap }
                            };
                            finalPos = positions[position];
                        }
                        
                        finalPos.left = Math.max(margin, Math.min(finalPos.left, window.innerWidth - contentRect.width - margin));
                        finalPos.top = Math.max(margin, Math.min(finalPos.top, window.innerHeight - contentRect.height - margin));
    
                        setContentStyle({ top: `${finalPos.top}px`, left: `${finalPos.left}px`, transform: 'translate(0, 0)' });
                    }
                }, 250);
    
                return () => clearTimeout(scrollTimeout);
            } else if (position === 'center') {
                setHighlightStyle({ opacity: 0 });
                if (contentBoxRef.current) {
                    setContentStyle({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
                }
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [step, currentStepConfig]);
    
  if (!currentStepConfig) return null;

  const { title, content } = currentStepConfig;
  const isFirstStep = step === 0;
  const isLastStep = step === totalSteps - 1;

  return (
    <>
      <div className="tutorial-overlay"></div>
      <div className="tutorial-highlight-box" style={highlightStyle}></div>
      
      <div className="tutorial-content-box" ref={contentBoxRef} style={contentStyle}>
        <h3>{title}</h3>
        <p>{content}</p>
        <div className="tutorial-navigation">
            <div>
              {!isLastStep && (
                <button onClick={onSkip} className="tutorial-button secondary tutorial-skip-button">
                  Skip Tutorial
                </button>
              )}
            </div>

            <div className="nav-right-group">
                {!isFirstStep && !isLastStep && <span className="tutorial-steps-indicator">{step}/{totalSteps - 2}</span>}
                {!isFirstStep && <button onClick={onPrev} className="tutorial-button secondary">Previous</button>}
                <button onClick={onNext} className="tutorial-button primary">
                    {isFirstStep ? 'Start Tour' : isLastStep ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;