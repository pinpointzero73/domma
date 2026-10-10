/**
 * 6. Badges, Pills & Number Badges - from public/showcase/themes.
 */
export function mount(root) {
    if (E.numberBadge) {
      E.numberBadge(root.querySelector('#numbadge-host-1'), { count: 12 });
      E.numberBadge(root.querySelector('#numbadge-host-2'), { count: 4 });
      E.numberBadge(root.querySelector('#numbadge-host-3'), { count: 99, max: 99 });
    }
}
