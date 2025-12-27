import React, { useState, useEffect } from 'react';
import { Project, ActivityLog, GitHubUser, GitHubRepo, GitHubEvent } from '../types';

interface UseGitHubDataResult {
    userData: GitHubUser | null;
    projects: Project[];
    activityLogs: ActivityLog[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export const useGitHubData = (initialProjects: Project[]): UseGitHubDataResult => {
    const [userData, setUserData] = useState<GitHubUser | null>(null);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
        { timestamp: '---', type: 'system', hash: '...', message: 'Scanning deep space frequencies...', url: '' }
    ]);

    useEffect(() => {
        const fetchGitHubProjects = async () => {
            // Check cache first
            const cachedData = localStorage.getItem('github_cache');
            const cacheTimestamp = localStorage.getItem('github_cache_time');
            const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

            if (cachedData && cacheTimestamp) {
                const cacheAge = Date.now() - parseInt(cacheTimestamp);
                if (cacheAge < CACHE_DURATION) {
                    try {
                        const { userData: cachedUser, projects: cachedProjects, logs: cachedLogs } = JSON.parse(cachedData);
                        if (cachedUser) setUserData(cachedUser);
                        if (cachedProjects?.length > 0) setProjects(cachedProjects);
                        if (cachedLogs?.length > 0) setActivityLogs(cachedLogs);
                        return; // Use cache, skip API calls
                    } catch { /* Invalid cache, continue to fetch */ }
                }
            }

            try {
                let fetchedUser = null;
                let fetchedProjects: Project[] = [];
                let fetchedLogs: ActivityLog[] = [];

                // Fetch user data (silently fail)
                try {
                    const userRes = await fetch('https://api.github.com/users/chelebyy');
                    if (userRes.ok) {
                        fetchedUser = await userRes.json();
                        setUserData(fetchedUser);
                    }
                } catch { /* Silent fail */ }

                // Fetch Repos (silently fail)
                try {
                    const response = await fetch('https://api.github.com/users/chelebyy/repos?sort=pushed&per_page=100');
                    if (response.ok) {
                        const data = await response.json();
                        if (Array.isArray(data)) {
                            fetchedProjects = data
                                .filter((repo: GitHubRepo) => !repo.fork)
                                .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
                                .slice(0, 50)
                                .map((repo: GitHubRepo, index: number) => ({
                                    id: repo.id.toString(),
                                    name: repo.name,
                                    description: repo.description || 'No description provided.',
                                    tags: [repo.language, 'GitHub'].filter(Boolean).slice(0, 3),
                                    stars: repo.stargazers_count >= 1000 ? (repo.stargazers_count / 1000).toFixed(1) + 'k' : repo.stargazers_count.toString(),
                                    order: (index + 1).toString().padStart(2, '0'),
                                    url: repo.html_url
                                }));
                            if (fetchedProjects.length > 0) setProjects(fetchedProjects);
                        }
                    }
                } catch { /* Silent fail */ }

                // Fetch Events (Activity Log) - silently fail
                try {
                    const eventsRes = await fetch('https://api.github.com/users/chelebyy/events');

                    if (eventsRes.ok) {
                        const events = await eventsRes.json();

                        // Filter for Releases and Tag Creations
                        const releaseEvents = events.filter((event: GitHubEvent) =>
                            event.type === 'ReleaseEvent' ||
                            (event.type === 'CreateEvent' && event.payload.ref_type === 'tag')
                        );

                        if (releaseEvents.length > 0) {
                            fetchedLogs = releaseEvents.slice(0, 10).map((event: GitHubEvent) => {
                                let message = '';
                                const type = 'release';
                                let hash = '';
                                let url = '';

                                if (event.type === 'ReleaseEvent' && event.payload.release) {
                                    hash = event.payload.release.tag_name;
                                    message = `[${event.repo.name}] ${event.payload.release.name || 'New Release'}`;
                                    url = event.payload.release.html_url;
                                } else {
                                    hash = event.payload.ref || '';
                                    message = `[${event.repo.name}] Tag created`;
                                    url = `https://github.com/${event.repo.name}/releases/tag/${event.payload.ref}`;
                                }

                                return {
                                    timestamp: new Date(event.created_at).toISOString().replace('T', ' ').substring(0, 16),
                                    type,
                                    hash,
                                    message,
                                    url
                                };
                            });
                            setActivityLogs(fetchedLogs);
                        }
                    }
                } catch { /* Silent fail */ }

                // Save to cache
                if (fetchedUser || fetchedProjects.length > 0 || fetchedLogs.length > 0) {
                    localStorage.setItem('github_cache', JSON.stringify({
                        userData: fetchedUser,
                        projects: fetchedProjects,
                        logs: fetchedLogs
                    }));
                    localStorage.setItem('github_cache_time', Date.now().toString());
                }
            } catch {
                // Outer silent fallback
            }
        };

        fetchGitHubProjects();
    }, []);

    return { userData, projects, activityLogs, setProjects };
};
