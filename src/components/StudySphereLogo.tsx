import React from 'react';

interface StudySphereLogoProps {
  className?: string;
  size?: number;
}

/**
 * StudySphere Brand Icon Mark
 * A refined, flat vector badge featuring:
 * - A central sphere/globe with clean meridian and latitude curves
 * - A single orbital ring in mint accent (#95D5B2)
 * - A small open book at its base in crisp off-white (#FAF9F6)
 * Optimized for legibility from 20px to 48px sizes.
 */
export function StudySphereLogo({ className = 'w-5 h-5', size }: StudySphereLogoProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {/* 1. Orbit Ring (Behind Globe) */}
      <path
        d="M 8.2 17.8 C 7.5 15.2 9.8 12.2 14.5 10.1 C 19.8 7.8 26.2 8 28.5 10.4"
        stroke="#95D5B2"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 2. Globe / Sphere Body */}
      <circle
        cx="18"
        cy="13.5"
        r="6.5"
        fill="#1B4332"
        stroke="#FAF9F6"
        strokeWidth="1.6"
      />

      {/* 3. Globe Meridian Curved Line (Simplified internal detail) */}
      <path
        d="M 18 7 C 15.2 9.5 15.2 17.5 18 20"
        stroke="#95D5B2"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* 4. Globe Latitude Curve */}
      <path
        d="M 12 14 C 14 15.8 22 15.8 24 14"
        stroke="#95D5B2"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* 5. Orbit Ring (In Front of Globe with Satellite Node) */}
      <path
        d="M 28.5 10.4 C 30.2 12.2 29.5 14.8 25.5 17.2 C 20.5 20.1 13.5 20.4 9.5 18.2"
        stroke="#95D5B2"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Orbit Satellite Bead */}
      <circle cx="28.2" cy="11.5" r="1.3" fill="#95D5B2" />

      {/* 6. Open Book at Base */}
      {/* Left Page */}
      <path
        d="M 18 22.8 C 14.8 21.2 11 21.6 8 23.5 L 8 28.2 C 11 26.3 14.8 25.9 18 27.5 Z"
        fill="#FAF9F6"
      />
      {/* Right Page */}
      <path
        d="M 18 22.8 C 21.2 21.2 25 21.6 28 23.5 L 28 28.2 C 25 26.3 21.2 25.9 18 27.5 Z"
        fill="#FAF9F6"
      />
      {/* Book Center Fold / Spine Divider */}
      <line
        x1="18"
        y1="22.8"
        x2="18"
        y2="27.5"
        stroke="#1B4332"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Page subtle interior reading lines in mint */}
      <path
        d="M 10.5 24.8 C 12.8 23.8 15.2 23.8 16.5 24.5"
        stroke="#95D5B2"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M 19.5 24.5 C 20.8 23.8 23.2 23.8 25.5 24.8"
        stroke="#95D5B2"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
