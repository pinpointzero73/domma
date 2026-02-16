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
}

export const effects: Effects;
