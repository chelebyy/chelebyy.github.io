import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SystemMonitor from './SystemMonitor';
import { translations } from '../constants/translations';

describe('SystemMonitor Component', () => {
    it('renders correctly', () => {
        render(<SystemMonitor lang="en" />);

        // Check title
        expect(screen.getByText(translations.en.sysMonitorTitle)).toBeInTheDocument();

        // Check table headers
        expect(screen.getByText(translations.en.sysPid)).toBeInTheDocument();
        expect(screen.getByText(translations.en.sysModuleName)).toBeInTheDocument();
    });

    it('renders modules', () => {
        render(<SystemMonitor lang="en" />);

        expect(screen.getByText('REACT_CORE_V19.dll')).toBeInTheDocument();
        expect(screen.getByText('TYPESCRIPT_COMPILER.exe')).toBeInTheDocument();
    });
});
