'use client';

import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import React, { useState } from 'react';

const StepIcons = {
  Box: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Gift: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 7H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 7C12 7 12 4 12 3C12 1.89543 12.8954 1 14 1C15.1046 1 16 1.89543 16 3C16 4.10457 15.1046 5 14 5H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 7C12 7 12 4 12 3C12 1.89543 11.1046 1 10 1C8.89543 1 8 1.89543 8 3C8 4.10457 8.89543 5 10 5H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Review: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Complete: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12V8H4V12M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V12M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>
  )
};

const SlideScenes = {
  Box: () => (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Premium Gift Box Scene */}
      <rect x="100" y="100" width="200" height="200" rx="8" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4"/>
      <rect x="90" y="90" width="220" height="30" rx="4" fill="currentColor" fillOpacity="0.2"/>
      <path d="M150 90 L150 290" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8"/>
      <path d="M250 90 L250 290" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8"/>
      {/* Size Indicators */}
      <path d="M50 150 L350 150" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
      <text x="360" y="155" fill="currentColor" fontSize="14">S</text>
      <path d="M50 200 L350 200" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
      <text x="360" y="205" fill="currentColor" fontSize="14">M</text>
      <path d="M50 250 L350 250" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
      <text x="360" y="255" fill="currentColor" fontSize="14">L</text>
    </svg>
  ),
  Items: () => (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Gift Items Selection Scene */}
      <g transform="translate(50, 50)">
        {/* Grid of Product Items */}
        {[0, 1, 2].map(row => (
          [0, 1, 2].map(col => (
            <g key={`${row}-${col}`} transform={`translate(${col * 100}, ${row * 100})`}>
              <rect x="10" y="10" width="80" height="80" rx="4" 
                fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2"/>
              <path d="M35 50 L65 50" stroke="currentColor" strokeWidth="2"/>
              <path d="M50 35 L50 65" stroke="currentColor" strokeWidth="2"/>
            </g>
          ))
        ))}
        {/* Selection Indicator */}
        <rect x="8" y="8" width="84" height="84" rx="6" 
          stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" fill="none"/>
      </g>
    </svg>
  ),
  Review: () => (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Review and Customize Scene */}
      <g transform="translate(50, 50)">
        {/* Gift Box Preview */}
        <rect x="100" y="50" width="200" height="200" rx="8" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4"/>
        {/* Customization Options */}
        <g transform="translate(20, 100)">
          <circle cx="15" cy="15" r="15" fill="currentColor" fillOpacity="0.2"/>
          <circle cx="15" cy="65" r="15" fill="currentColor" fillOpacity="0.2"/>
          <circle cx="15" cy="115" r="15" fill="currentColor" fillOpacity="0.2"/>
          {/* Option Lines */}
          <path d="M40 15 H80" stroke="currentColor" strokeWidth="2"/>
          <path d="M40 65 H80" stroke="currentColor" strokeWidth="2"/>
          <path d="M40 115 H80" stroke="currentColor" strokeWidth="2"/>
        </g>
        {/* Checkmark */}
        <path d="M320 50 L340 70 L370 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </g>
    </svg>
  ),
  Complete: () => (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Order Completion Scene */}
      <g transform="translate(50, 50)">
        {/* Shopping Cart */}
        <circle cx="100" cy="250" r="20" stroke="currentColor" strokeWidth="4"/>
        <circle cx="250" cy="250" r="20" stroke="currentColor" strokeWidth="4"/>
        <path d="M50 50 L300 50 L270 200 L80 200 Z" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4"/>
        {/* Success Checkmark */}
        <circle cx="175" cy="125" r="40" stroke="currentColor" strokeWidth="4"/>
        <path d="M155 125 L175 145 L195 105" 
          stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Security Shield */}
        <path d="M150 270 L200 270 L200 320 L175 340 L150 320 Z" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"/>
        <path d="M175 285 L175 315" stroke="currentColor" strokeWidth="2"/>
        <circle cx="175" cy="320" r="2" fill="currentColor"/>
      </g>
    </svg>
  )
};

const steps = [
  {
    icon: StepIcons.Box,
    title: '1. Choose Your Box',
    description: 'Select from our range of premium gift boxes.',
    details: [
      'Multiple sizes available',
      'Premium materials',
      'Elegant design options'
    ],
    color: 'from-blue-500 to-indigo-500',
    Scene: SlideScenes.Box
  },
  {
    icon: StepIcons.Gift,
    title: '2. Add Your Items',
    description: 'Curate your perfect gift selection.',
    details: [
      'Curated product selection',
      'Mix and match items',
      'Volume discounts available'
    ],
    color: 'from-purple-500 to-pink-500',
    Scene: SlideScenes.Items
  },
  {
    icon: StepIcons.Review,
    title: '3. Review & Customize',
    description: 'Perfect your gift presentation.',
    details: [
      'Preview your selection',
      'Adjust quantities',
      'Special handling options'
    ],
    color: 'from-emerald-500 to-teal-500',
    Scene: SlideScenes.Review
  },
  {
    icon: StepIcons.Complete,
    title: '4. Complete Your Order',
    description: 'Finalize your perfect gift.',
    details: [
      'Secure checkout',
      'Gift message option',
      'Premium packaging included'
    ],
    color: 'from-amber-500 to-orange-500',
    Scene: SlideScenes.Complete
  }
];

export function GiftBuilderModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? prev : prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev === 0 ? prev : prev - 1));
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return React.createElement('div',
    { className: "fixed inset-0 z-50 overflow-y-auto" },
    [
      React.createElement('div',
        { 
          key: "backdrop",
          className: "fixed inset-0 bg-black/30 backdrop-blur-sm",
          onClick: onClose 
        }
      ),
      React.createElement('div',
        { 
          key: "modal-container",
          className: "flex min-h-full items-center justify-center p-4" 
        },
        React.createElement('div',
          { 
            className: "relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white p-6 shadow-xl dark:bg-primary-900" 
          },
          [
            // Progress Bar
            React.createElement('div',
              { 
                key: "progress-bar",
                className: "absolute left-0 top-0 h-1 w-full bg-primary-100 dark:bg-primary-800" 
              },
              React.createElement('div',
                {
                  className: "h-full bg-accent-500",
                  style: { width: `${((currentStep + 1) / steps.length) * 100}%` }
                }
              )
            ),

            // Close Button
            React.createElement('button',
              {
                key: "close-button",
                onClick: onClose,
                className: "absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              },
              React.createElement(X, { size: 24 })
            ),

            // Content Container
            React.createElement('div',
              {
                key: "content",
                className: "mt-6 grid gap-8 md:grid-cols-2"
              },
              [
                // Left Column - Image
                React.createElement('div',
                  {
                    key: "left-column",
                    className: `relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${currentStepData.color}`
                  },
                  React.createElement(currentStepData.Scene, {
                    className: "h-full w-full"
                  })
                ),

                // Right Column - Content
                React.createElement('div',
                  {
                    key: "right-column",
                    className: "flex flex-col justify-between"
                  },
                  [
                    React.createElement('div',
                      { key: "step-content" },
                      [
                        React.createElement('h2',
                          {
                            key: "title",
                            className: "text-2xl font-bold"
                          },
                          currentStepData.title
                        ),
                        React.createElement('p',
                          {
                            key: "description",
                            className: "mt-2 text-gray-600 dark:text-gray-300"
                          },
                          currentStepData.description
                        ),
                        React.createElement('ul',
                          {
                            key: "details",
                            className: "mt-4 space-y-2"
                          },
                          currentStepData.details.map((detail, index) =>
                            React.createElement('li',
                              {
                                key: index,
                                className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                              },
                              [
                                React.createElement('div',
                                  {
                                    key: "bullet",
                                    className: "h-1.5 w-1.5 rounded-full bg-accent-500"
                                  }
                                ),
                                detail
                              ]
                            )
                          )
                        )
                      ]
                    ),

                    // Navigation Buttons
                    React.createElement('div',
                      {
                        key: "navigation",
                        className: "mt-8 flex justify-between gap-4"
                      },
                      [
                        React.createElement('button',
                          {
                            key: "prev-button",
                            onClick: prevStep,
                            disabled: currentStep === 0,
                            className: "flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                          },
                          [
                            React.createElement(ArrowLeft, { key: "prev-icon", size: 16 }),
                            "Previous"
                          ]
                        ),
                        React.createElement('button',
                          {
                            key: "next-button",
                            onClick: currentStep === steps.length - 1 ? onClose : nextStep,
                            className: "flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600"
                          },
                          [
                            currentStep === steps.length - 1 ? "Complete" : "Next",
                            React.createElement(ArrowRight, { key: "next-icon", size: 16 })
                          ]
                        )
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
      )
    ]
  );
}