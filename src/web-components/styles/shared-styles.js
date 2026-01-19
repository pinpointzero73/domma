/**
 * Shared styles for Domma Web Components
 * These styles are used across multiple components
 */

/**
 * Base reset and common styles
 */
export const baseStyles = `
    * {
        box-sizing: border-box;
    }

    :host([hidden]) {
        display: none !important;
    }
`;

/**
 * Common button styles for close/action buttons
 */
export const buttonStyles = `
    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
        transition: opacity var(--dm-transition-fast);
    }

    button:hover {
        opacity: 0.8;
    }

    button:focus {
        outline: 2px solid var(--dm-primary);
        outline-offset: 2px;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

/**
 * Utility classes for common layouts
 */
export const utilityStyles = `
    .flex {
        display: flex;
    }

    .inline-flex {
        display: inline-flex;
    }

    .items-center {
        align-items: center;
    }

    .justify-center {
        justify-content: center;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;

/**
 * Animation keyframes
 */
export const animationStyles = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
