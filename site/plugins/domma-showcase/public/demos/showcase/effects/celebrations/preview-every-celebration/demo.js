/**
 * Preview every celebration - from public/examples/celebrations, rebuilt on bindings.
 *
 * The celebrations are the domma-celebrate package; this site serves its build from
 * the installed Domma JS package. A preview runs whatever the date, and even for a visitor
 * who asked for less motion - they came here to see it.
 */
const CELEBRATE = '/dist/domma/celebrate/domma-celebrate.esm.js?v=1.4.0';

const THEMES = [
    {id: 'winter', emoji: '❄️', name: 'Winter', dates: 'Dec-Feb, after specific holidays', draws: 'Snowflakes, frosted pines, snowdrifts, icicles and winter stars'},
    {id: 'make-it-rain', emoji: '🌧️', name: 'Make it rain', dates: 'Manual only', draws: 'Falling water and ground splashes'},
    {id: 'money-rain', emoji: '💸', name: 'Money Rain', dates: 'Manual only', draws: 'Fluttering banknotes'},
    {id: 'graduation', emoji: '🎓', name: 'Graduation', dates: 'Manual only', draws: 'Tossed caps, diplomas and a sparkler greeting'},
    {id: 'birthday', emoji: '🎂', name: 'Birthday', dates: 'Manual only', draws: 'Cake, balloons, confetti and a sparkler greeting'},
    {id: 'anniversary', emoji: '💍', name: 'Anniversary', dates: 'Manual only', draws: 'Rings, hearts and a sparkler greeting'},
    {id: 'greeting', emoji: '✨', name: 'Greeting', dates: 'Manual only', draws: 'Standalone sparkler lettering'},
    {id: 'autumn', emoji: '🍂', name: 'Autumn', dates: 'Sep-Nov, after specific holidays', draws: 'Leaves, acorns and mushrooms'},
    {id: 'chinese-new-year', emoji: '🐉', name: 'Chinese New Year', dates: 'Seven days from lunar New Year', draws: 'Chinese dragon, lanterns, fireworks, confetti and a sparkler greeting'},
    {id: 'new-year', emoji: '🎉', name: 'New Year', dates: '31 Dec - 2 Jan', draws: 'Confetti, streamers, fireworks, balloons and a midnight clock'},
    {id: 'easter', emoji: '🐣', name: 'Easter', dates: 'Tuesday before Easter - Easter Monday', draws: 'Blossom, decorated eggs, a bunny, flowers and butterflies'},
    {id: 'summer-garden', emoji: '🌼', name: 'Summer Garden', dates: '1 Jun - 31 Aug', draws: 'Petals, flowers, butterflies, bumblebees and ladybirds'},
    {id: 'christmas', emoji: '🎄', name: 'Christmas', dates: '1 Dec - 30 Dec', draws: "Snowflakes, Santa's sleigh and reindeer, trees, wreaths, toy trains, robins, elves"},
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
