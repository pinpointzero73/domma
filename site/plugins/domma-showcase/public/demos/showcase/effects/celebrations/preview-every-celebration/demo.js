/**
 * Preview every celebration - from public/examples/celebrations, rebuilt on bindings.
 *
 * The celebrations are the domma-celebrate package; this site serves its build from
 * the dommajs-site plugin. A preview runs whatever the date, and even for a visitor
 * who asked for less motion - they came here to see it.
 */
const CELEBRATE = '/plugins/dommajs-site/public/vendor/celebrate/domma-celebrate.esm.js';

const THEMES = [
    {id: 'christmas', emoji: '🎄', name: 'Christmas', dates: '1 Dec - 1 Jan', draws: "Snowflakes, Santa's sleigh and reindeer, trees, wreaths, toy trains, robins, elves"},
    {id: 'halloween', emoji: '🎃', name: 'Halloween', dates: '26-31 Oct', draws: 'Pumpkins, spiders, witches, bats, gravestones, jack-o-lanterns'},
    {id: 'valentines', emoji: '💕', name: "Valentine's Day", dates: '9-14 Feb', draws: 'Hearts, rose petals, cupid, heart garlands, sparkles'},
    {id: 'guy-fawkes', emoji: '🎆', name: 'Guy Fawkes', dates: '1-5 Nov', draws: 'Sparks, rockets, bonfires, Catherine wheels, Roman candles'},
    {id: 'st-patricks', emoji: '☘️', name: "St Patrick's", dates: '12-17 Mar · Ireland', draws: 'Shamrocks, gold coins, leprechauns, banshees, pots of gold, rainbows'},
    {id: 'st-andrews', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', name: "St Andrew's", dates: '25-30 Nov · Scotland', draws: 'Thistles, snowflakes, a bagpiper, saltire flags, tartan'},
    {id: 'st-davids', emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', name: "St David's", dates: '24 Feb - 1 Mar · Wales', draws: 'Daffodils, leeks, dragons, daffodil fields'},
    {id: 'st-georges', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: "St George's", dates: '18-23 Apr · England', draws: 'Rose petals, knights, dragons, St George flags'}
];

export async function mount(root) {
    const {Celebrations} = await import(CELEBRATE);
    const known = Celebrations.getThemes();

    const theme = M.observable('auto');
    const intensity = M.observable('medium');
    const running = M.observable(false);
    const showing = M.observable('None');
    const particles = M.observable(0);
    const today = M.observable(D().format('dddd D MMMM YYYY'));
    const traits = M.observable([]);
    let chosenTraits = {};       // kept across celebrations: each theme reads only its own names
    let effect = null;

    const nameOf = (id) => (id && known[id] ? `${known[id].emoji} ${known[id].displayName}` : 'None');
    const refresh = () => {
        showing.value = nameOf(theme.value === 'auto' ? Celebrations.getCurrentTheme() : theme.value);
        particles.value = effect?.particles ? effect.particles.length + (effect.specialParticles?.length || 0) : 0;
        const list = effect ? effect.getTraits() : {};
        traits.value = Object.entries(list).map(([name, t]) => ({name, label: t.label, enabled: !!t.enabled}));
    };

    async function load() {
        effect?.destroy();
        effect = new Celebrations({theme: theme.value, intensity: intensity.value, enabled: false,
            traits: chosenTraits, respectMotionPreference: false});
        await effect.init();
        if (running.value) effect.start();
        refresh();
    }

    const state = {
        theme, intensity, running, showing, particles, today, traits, themes: THEMES,
        async themeChanged() {
            if (effect) await effect.setTheme(theme.value); else await load();
            refresh();
        },
        setIntensity(level) {
            intensity.value = level;
            effect?.setIntensity(level);
        },
        toggle() {
            if (!effect) return;
            running.value = !running.value;
            if (running.value) effect.start();
            else { effect.pause(); effect.canvasManager?.clear(); }
            refresh();
        },
        async show(card) {
            theme.value = card.id;
            await state.themeChanged();
            if (!running.value) state.toggle();
        },
        setTrait(trait, event) {
            chosenTraits[trait.name] = event.target.checked;
            effect?.setTrait(trait.name, event.target.checked);
            refresh();
        },
        allTraits(on) {
            if (!effect) return;
            const settings = Object.fromEntries(Object.keys(effect.getTraits()).map(n => [n, on]));
            chosenTraits = {...chosenTraits, ...settings};
            effect.setTraits(settings);
            refresh();
        }
    };

    const bindings = M.applyBindings(state, root);
    await load();
    const ticker = setInterval(() => {
        particles.value = effect?.particles ? effect.particles.length + (effect.specialParticles?.length || 0) : 0;
    }, 1000);

    return () => {
        clearInterval(ticker);
        effect?.destroy();
        bindings?.dispose?.();
    };
}
