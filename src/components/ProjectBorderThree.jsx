import React from 'react';

const ProjectBorderThree = ({ isHovered }) => {
  return (
    <div className="project-border-beam-wrap">
      {/* Subtle border base */}
      <div
        className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
          isHovered
            ? 'border-primary/50 shadow-[0_0_25px_rgba(14,165,233,0.35)]'
            : 'border-white/5'
        }`}
      />

      {/* Dynamic Laser Beam Pulse running along border on hover */}
      {isHovered && (
        <>
          <div className="project-border-pulse" />
          <div className="absolute inset-[1px] rounded-2xl bg-slate-900/90" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/15 pointer-events-none" />
        </>
      )}
    </div>
  );
};

export default ProjectBorderThree;

