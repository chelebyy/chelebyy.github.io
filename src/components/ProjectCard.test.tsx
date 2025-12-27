import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import { Project } from '../types';

const mockProject: Project = {
    id: '1',
    name: 'Test Project',
    description: 'A test project description.',
    tags: ['React', 'TypeScript'],
    stars: '1.5k',
    order: '01',
    url: 'https://example.com'
};

describe('ProjectCard Component', () => {
    it('renders project details correctly', () => {
        render(<ProjectCard project={mockProject} />);

        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.getByText('A test project description.')).toBeInTheDocument();
        expect(screen.getByText('01_Project')).toBeInTheDocument();
        expect(screen.getByText('★ 1.5k')).toBeInTheDocument();
    });

    it('renders tags correctly', () => {
        render(<ProjectCard project={mockProject} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('links to the correct URL', () => {
        render(<ProjectCard project={mockProject} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://example.com');
    });
});
