import React from 'react';

export function HeaderFlourish() {
  return (
    <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-28 md:w-32 h-6 sm:h-7 md:h-8 opacity-10 sm:opacity-15 pointer-events-none">
      <img
        src="/assets/generated/islamic-divider-flourish.dim_1200x200.png"
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  );
}
