import React from 'react';
import { Project } from '../types';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <a className="group border-b border-r border-border-dark bg-surface-dark p-8 flex flex-col justify-between h-[320px] border-glitch relative overflow-hidden flex-shrink-0" href={project.url || '#'}>
        {/* Target Lock Corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-2 group-hover:left-2"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-2 group-hover:right-2"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bottom-2 group-hover:left-2"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bottom-2 group-hover:right-2"></div>

        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-primary">arrow_outward</span>
        </div>
        <div>
            <div className="font-mono text-xs text-primary mb-3 flex items-center gap-2 uppercase">
                <span className="w-2 h-2 bg-primary block"></span> {project.order}_Project
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {project.description}
            </p>
        </div>
        <div className="mt-6 pt-6 border-t border-dashed border-gray-800 flex justify-between items-end">
            <div className="flex gap-2">
                {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300">{tag}</span>
                ))}
            </div>
            <div className="text-right font-mono text-xs text-gray-500">
                ★ {project.stars}
            </div>
        </div>
    </a>
);

export default ProjectCard;
