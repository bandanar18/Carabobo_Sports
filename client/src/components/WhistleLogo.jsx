import React from 'react';

export default function WhistleLogo({ size = 32, showText = true, textColor = '#FFFFFF', dark = false }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Whistle sound lines */}
        <path d="M42 16L39 8" stroke="#F36F21" strokeWidth="6" strokeLinecap="round" />
        <path d="M52 14L52 6" stroke="#F36F21" strokeWidth="6" strokeLinecap="round" />
        <path d="M62 17L66 9" stroke="#F36F21" strokeWidth="6" strokeLinecap="round" />

        {/* Whistle Body */}
        <path
          d="M20 54C20 40 32 30 48 30H82C85 30 87 32 87 35V45C87 48 85 50 82 50H65C62 50 60 52 60 55C60 68 49 78 35 78C25 78 20 68 20 54Z"
          fill="#F36F21"
        />
        {/* Whistle Ring / Eye */}
        <circle cx="36" cy="54" r="9" fill="#0B1E36" />
        <circle cx="36" cy="54" r="5" fill="#FFFFFF" />
        {/* Whistle Mouthpiece slot */}
        <rect x="74" y="34" width="8" height="12" rx="2" fill="#D95810" />
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: size * 0.7,
            letterSpacing: '0.04em',
            color: dark ? '#0B1E36' : textColor,
            lineHeight: 1
          }}
        >
          SPORT-FLOW
        </span>
      )}
    </div>
  );
}
