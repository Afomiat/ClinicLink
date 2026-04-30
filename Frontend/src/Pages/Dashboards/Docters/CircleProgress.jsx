import React, { useEffect, useRef } from 'react';
import Circles from 'circles.js';

const CircleProgress = ({ value, label, color = '#00c9a7' }) => {
  const circleRef = useRef(null);

  useEffect(() => {
    if (circleRef.current) {
      // Determine whether the value should be displayed as a percentage or a raw number
      const displayValue = label === 'Completed' ? `${value}%` : value;

      Circles.create({
        id: circleRef.current.id,
        radius: 30,
        value: value,
        maxValue: label === 'Completed' ? 100 : value, // 100 for percentages, or value for others
        width: 15,
        text: displayValue, // Display either the raw number or percentage
        colors: ['#f1f1f1', color],
        duration: 1000,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        styleWrapper: true,
        styleText: true,
      });
    }
  }, [value, label, color]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div id={`circle-${label}`} ref={circleRef}></div>
      <p>{label}</p>
    </div>
  );
};

export default CircleProgress;
