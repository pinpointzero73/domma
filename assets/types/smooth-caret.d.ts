export type CaretPreference = 'auto' | 'smooth' | 'native';
export interface SmoothCaretHandle {
    refresh(): void;
    destroy(): void;
}
export interface SmoothCaret {
    attach(element: HTMLInputElement | HTMLTextAreaElement | HTMLElement): SmoothCaretHandle;
    install(root?: Document | HTMLElement | ShadowRoot): {destroy(): void};
    getPreference(): CaretPreference;
    setPreference(value: CaretPreference): void;
}
export declare const smoothCaret: SmoothCaret;
