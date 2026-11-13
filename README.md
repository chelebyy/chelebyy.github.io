<div align="center">
  <h3>chelebyy:~/open-source$</h3>
  <p>A terminal-style home for my open source projects.</p>

  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-blue?style=for-the-badge&labelColor=333" alt="English"></a>
  <a href="README.TR.md"><img src="https://img.shields.io/badge/Lang-Turkish-gray?style=for-the-badge&labelColor=333" alt="Turkish"></a>

  <br /><br />

  [![Live](https://img.shields.io/badge/live-cheleby.me-4f6bff?style=flat-square)](https://cheleby.me)
  [![CI/CD](https://github.com/chelebyy/chelebyy.github.io/actions/workflows/ci-cd.yaml/badge.svg)](https://github.com/chelebyy/chelebyy.github.io/actions)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
</div>

---

## What it does

- **Projects come straight from GitHub.** Every public repository of `chelebyy` is listed automatically with its description, language, license, topics and last push. Nothing is hand-written or simulated.
- **You decide what is hidden.** Edit [`src/config/site.ts`](src/config/site.ts):

  ```ts
  hiddenRepos: ['chelebyy.github.io', 'link-manager', 'StokTakip'], // never shown
  visibleForks: ['claude-liveroom'], // forks are hidden unless listed here
  showArchived: true,    // archived repos get an "archived" label
  ```

  Names are case-insensitive. Hidden repositories disappear from the project list *and* the activity log, including data already cached in visitors' browsers.
- **Activity log:** recent releases, tags, pushes and merged pull requests of the visible repositories, in `git log` style.
- **`grep` and language filters** over the project list.
- **neofetch panel** with real numbers: repository count, top languages, last push.
- **Terminal (`Ctrl + K`):** `ls`, `open <project>`, `neofetch`, `theme <blue|red|green|purple>`, `matrix`, `whoami`, `sudo`, `reboot`, `clear`, `exit`.
- **Effects:** a short intro typed in green phosphor on a vintage computer that breaks up into TV static before the site cuts in (about 5.8 s, once per session, skippable, never shown with reduced motion), Matrix rain (`matrix` in the terminal), and a system log (`tail -f sys.log`).
- **Easter egg:** `.secret/` below the project list wants a passcode. The system log knows it.
- English and Turkish; the browser language is used on the first visit.

GitHub data is cached in `localStorage` for 10 minutes so visitors stay well below the API's unauthenticated rate limit. If GitHub does not answer, the page says so instead of showing placeholder projects.

## Development

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test           # Vitest unit tests
npm run test:e2e   # Playwright; the GitHub API is stubbed in e2e/github-stub.ts
npm run build
```

Stack: React 19, Vite 8, Tailwind CSS 4 (compiled at build time), TypeScript, Vitest, Playwright.

## Deployment

Every push to `main` runs lint, type check, unit tests, the Playwright suite and `npm audit`, then publishes the build to GitHub Pages (`cheleby.me`).

## Credits

The vintage computer in the intro (`public/intro/retro-computer.webp`) is an AI-generated illustration by Andy_Eneses on [Pixabay](https://pixabay.com/illustrations/vintage-computer-retro-1960s-9861874/), used under the [Pixabay Content License](https://pixabay.com/service/license-summary/). It was resized and re-encoded for the site; the terminal text is drawn on top of it.

---

<div align="center">
  <sub>Built by <a href="https://github.com/chelebyy">@chelebyy</a></sub>
</div>
