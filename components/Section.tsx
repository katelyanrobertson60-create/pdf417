
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <h2 className="text-xl font-semibold text-sky-400 mb-4 pb-2 border-b border-slate-700">{title}</h2>
      {children}
    </section>
  );
};
