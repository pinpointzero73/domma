/**
 * Domma Effects Module
 * Visual effects and animations for UI elements
 */

export interface EffectControl {
    /** Pause the effect */
    pause(): void;
    /** Resume the effect */
    resume(): void;
    /** Stop the effect */
    stop(): void;
    /** Restart the effect from the beginning */
    restart(): void;
    /** Destroy the effect and clean up all resources */
    destroy(): void;
    /** Check if the effect is currently running */
    isRunning(): boolean;
    /** Check if the effect is paused */
    isPaused(): boolean;
}

export type Selector = string | Element | NodeList | HTMLElement[];

export interface BreatheOptions {
    amplitude?: number;
    duration?: number;
    easing?: string;
    delay?: number;
    stagger?: number;
    iterations?: number | 'infinite';
    pauseOnHover?: boolean;
    autoStart?: boolean;
    respectMotionPreference?: boolean;
    onStart?: () => void;
    onComplete?: () => void;
}

export interface PulseOptions {
    scale?: number;
    duration?: number;
    easing?: string;
    delay?: number;
    stagger?: number;
    iterations?: number | 'infinite';
    pauseOnHover?: boolean;
    respectMotionPreference?: boolean;
}

export interface ScribeAction {
    render?: string;
    effect?: 'none' | 'fade' | 'bounce' | 'glow';
    wait?: string | number;
    undoRender?: boolean | number | 'all';
}

export interface ScribeOptions {
    mode?: 'typewriter' | 'word' | 'sentence';
    speed?: number;
    deleteSpeed?: number;
    cursor?: boolean;
    cursorChar?: string;
    cursorBlink?: boolean;
    cursorType?: 'caret' | 'block' | 'underline';
    loop?: boolean | number;
    loopDelay?: number;
    pauseOnHover?: boolean;
    autoStart?: boolean;
    respectMotionPreference?: boolean;
    actions?: ScribeAction[];
    onStart?: () => void;
    onComplete?: () => void;
    onCharacter?: (unit: string, index: number) => void;
    onRender?: (text: string) => void;
    onUndoRender?: (deletedText: string) => void;
    onLoop?: (loopCount: number) => void;
}

export interface RevealOptions {
    animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'flip';
    duration?: number;
    easing?: string;
    delay?: number;
    stagger?: number;
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
    respectMotionPreference?: boolean;
    onReveal?: (element: Element) => void;
}

export interface ScrambleOptions {
    speed?: number;
    scrambleSpeed?: number;
    characters?: string;
    revealOrder?: 'left-to-right' | 'right-to-left' | 'random' | 'center-out';
    scrambleDuration?: number;
    stagger?: number;
    loop?: boolean | number;
    loopDelay?: number;
    respectMotionPreference?: boolean;
    onComplete?: () => void;
    onCharacter?: (char: string, index: number) => void;
}

export interface CounterOptions {
    from?: number;
    to?: number | null;
    duration?: number;
    easing?: 'linear' | 'ease-out' | 'ease-in-out';
    decimals?: number;
    separator?: string;
    prefix?: string;
    suffix?: string;
    stagger?: number;
    trigger?: 'immediate' | 'scroll';
    threshold?: number;
    respectMotionPreference?: boolean;
    onUpdate?: (currentValue: number) => void;
    onComplete?: () => void;
}

export interface RippleOptions {
    colour?: string;
    duration?: number;
    opacity?: number;
    unbounded?: boolean;
    centered?: boolean;
    trigger?: 'click' | 'mousedown' | 'pointerdown';
    respectMotionPreference?: boolean;
}

export interface ShakeOptions {
    intensity?: number;
    duration?: number;
    direction?: 'horizontal' | 'vertical' | 'both';
    easing?: string;
    iterations?: number;
    stagger?: number;
    respectMotionPreference?: boolean;
    onComplete?: () => void;
}

export interface TwinkleOptions {
    count?: number;
    minSize?: number;
    maxSize?: number;
    twinkleSpeed?: number;
    colour?: string;
    zIndex?: number;
    shape?: 'star' | 'circle';
    respectMotionPreference?: boolean;
}

export type TickerTapePalette =
    | 'theme'
    | 'rainbow'
    | 'festive'
    | 'gold'
    | 'silver'
    | 'pastel'
    | 'mono'
    | 'sunset'
    | 'ocean'
    | 'forest'
    | 'bridal'
    | string[];

export interface TickerTapeOptions {
    /** Named palette or custom array of CSS colour strings (default 'theme') */
    palette?: TickerTapePalette;
    /** Average number of strips on screen at once (default 50) */
    density?: number;
    /** Fall-speed multiplier (default 1) */
    speed?: number;
    /** Horizontal sway amplitude in pixels (default 60) */
    sway?: number;
    /** Maximum rotation in degrees per frame (default 6) */
    rotationSpeed?: number;
    /** Minimum strip width in pixels (default 5) */
    minWidth?: number;
    /** Maximum strip width in pixels (default 9) */
    maxWidth?: number;
    /** Minimum strip height in pixels (default 12) */
    minHeight?: number;
    /** Maximum strip height in pixels (default 22) */
    maxHeight?: number;
    /** Fraction of fall before fade begins, 0–1 (default 0.55) */
    fadeStart?: number;
    /** Drop a single batch and stop respawning (default false) */
    burst?: boolean;
    /** Number of strips emitted in burst mode (default 150) */
    burstCount?: number;
    /** Canvas stacking order (default 1) */
    zIndex?: number;
    /** Honour prefers-reduced-motion OS setting (default true) */
    respectMotionPreference?: boolean;
}

export interface ButterfliesOptions {
    /** Named palette or custom array of CSS colour strings (default 'meadow') */
    palette?: TickerTapePalette | string | string[];
    /** Target butterflies on screen at once (default 18) */
    density?: number;
    /** Global speed multiplier (default 1) */
    speed?: number;
    /** Steering erraticness (default 1) */
    wander?: number;
    /** Upward drift bias (default 0.4) */
    riseSpeed?: number;
    /** Wingbeat rate multiplier (default 1) */
    flapSpeed?: number;
    /** Minimum wingspan in pixels (default 14) */
    minSize?: number;
    /** Maximum wingspan in pixels (default 26) */
    maxSize?: number;
    /** Use two palette colours per butterfly (default true) */
    twoTone?: boolean;
    /** Release a single batch then settle (default false) */
    burst?: boolean;
    /** Butterflies released in burst mode (default 40) */
    burstCount?: number;
    /** Canvas stacking order (default 1) */
    zIndex?: number;
    /** Honour prefers-reduced-motion OS setting (default true) */
    respectMotionPreference?: boolean;
}

export interface StrobeOptions {
    /** Named preset: 'club' | 'concert' | 'police' | 'searchlight' | 'scanner' | 'mood' (default 'club'). Individual options override the preset. */
    preset?: string;
    /** Corners beams emit from: any of 'tl', 'tr', 'bl', 'br' */
    origins?: string[];
    /** 'sweep' (fan back and forth) or 'rotate' (full circle) */
    motion?: string;
    /** Degrees a beam fans across in sweep mode */
    sweepArc?: number;
    /** Sweep/rotation speed multiplier */
    speed?: number;
    /** Angular width of each beam cone in degrees */
    beamWidth?: number;
    /** Blink beams on/off — the strobe character */
    flicker?: boolean;
    /** Flicker rate in flashes per second — warns above 5 */
    hz?: number;
    /** Beam colours (hex), assigned per beam in order */
    colours?: string[];
    /** Beam brightness, 0–1 */
    intensity?: number;
    /** Auto-stop after N milliseconds (default null) */
    duration?: number | null;
    /** Stacking order (default 9999) */
    zIndex?: number;
    /** Honour prefers-reduced-motion OS setting (default true) */
    respectMotionPreference?: boolean;
}

export interface Effects {
    /** Sinusoidal floating animation */
    breathe(selector: Selector, options?: BreatheOptions): EffectControl | null;
    /** Pulsing scale animation */
    pulse(selector: Selector, options?: PulseOptions): EffectControl | null;
    /** Text animation with configurable granularity (characters, words, or sentences) and action queue */
    scribe(selector: Selector, options?: ScribeOptions): EffectControl | null;
    /** Scroll-triggered entrance animations using IntersectionObserver */
    reveal(selector: Selector, options?: RevealOptions): EffectControl | null;
    /** Text cipher/decode animation */
    scramble(selector: Selector, options?: ScrambleOptions): EffectControl | null;
    /** Animated number counting with easing and formatting */
    counter(selector: Selector, options?: CounterOptions): EffectControl | null;
    /** Material Design click ripple effect */
    ripple(selector: Selector, options?: RippleOptions): EffectControl | null;
    /** Attention/error shake animation */
    shake(selector: Selector, options?: ShakeOptions): EffectControl | null;
    /** Canvas-based twinkling stars animation */
    twinkle(selector: Selector | null, options?: TwinkleOptions): EffectControl | null;
    /** Canvas-based ticker-tape parade — colourful rectangles fall, sway, rotate, and fade */
    tickerTape(selector: Selector | null, options?: TickerTapeOptions): EffectControl | null;
    butterflies(selector: Selector | null, options?: ButterfliesOptions): EffectControl | null;
    strobe(selector: Selector | null, options?: StrobeOptions): EffectControl | null;
}

export const effects: Effects;
