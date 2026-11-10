import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import { Project } from '../types';

const project: Project = {
    id: '1',
    name: 'ai-office',
    description: 'Watch your agents work in a virtual office.',
    language: 'TypeScript',
    topics: ['agents', 'codex'],
    stars: 3,
    forks: 1,
    url: 'https://github.com/chelebyy/ai-office',
    homepage: 'https://example.com/demo',
    pushedAt: '2026-11-01T00:00:00Z',
    archived: false,
    fork: false,
    license: 'MIT',
};

const renderCard = (overrides: Partial<Project> = {}) =>
    render(<ul><ProjectCard project={{ ...project, ...overrides }} lang="en" index={0} /></ul>);

describe('ProjectCard Component', () => {
    it('renders the project details from GitHub', () => {
        renderCard();
        expect(screen.getByRole('heading', { name: 'ai-office' })).toBeInTheDocument();
        expect(screen.getByText(project.description)).toBeInTheDocument();
        expect(screen.queryByText(/★/)).not.toBeInTheDocument();
        expect(screen.getByText('MIT')).toBeInTheDocument();
        expect(screen.getByText('#agents')).toBeInTheDocument();
    });

    it('links the name to the repository and the demo to the homepage', () => {
        renderCard();
        expect(screen.getByRole('link', { name: 'ai-office' })).toHaveAttribute('href', project.url);
        expect(screen.getByRole('link', { name: /demo/ })).toHaveAttribute('href', project.homepage);
    });

    it('shows a placeholder instead of inventing a description, and labels archived repos', () => {
        renderCard({ description: '', archived: true, homepage: null });
        expect(screen.getByText('No description yet.')).toBeInTheDocument();
        expect(screen.getByText('archived')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /demo/ })).not.toBeInTheDocument();
    });
});
