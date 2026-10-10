/**
 * 17. Progression - Timeline & Roadmap - from public/showcase/themes.
 */
export function mount(root) {
    E.progression(root.querySelector('#audit-timeline'), {
      mode: 'timeline',
      items: [
        { year: 2023, title: 'Founded', description: 'Company established and first round of seed funding raised.' },
        { year: 2024, title: 'Series A', description: 'Closed a £10m Series A led by Acme Ventures.' },
        { year: 2025, title: 'Expansion', description: 'Opened offices in Berlin, Paris, and Amsterdam.' },
        { year: 2026, title: 'Public release', description: 'Domma 1.0 ships to general availability.' }
      ]
    });
}
