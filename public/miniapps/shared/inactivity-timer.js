/**
 * Inactivity auto-logout timer
 *
 * Monitors user activity and logs out after a configurable period of inactivity.
 * Used by MiniApps and Admin pages. Timeout values come from shared/config.js.
 *
 * @module miniapps/shared/inactivity-timer
 */

const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

export class InactivityTimer {
    /**
     * @param {object} options
     * @param {number} options.timeoutMs       - Total inactivity timeout in ms (e.g. 20 * 60 * 1000)
     * @param {number} options.warningMs       - How many ms before timeout to show warning
     * @param {Function} options.onTimeout     - Called when timeout fires (should trigger logout)
     * @param {Function} [options.onWarning]   - Called when warning threshold is reached
     */
    constructor({ timeoutMs, warningMs, onTimeout, onWarning }) {
        this._timeoutMs  = timeoutMs;
        this._warningMs  = warningMs;
        this._onTimeout  = onTimeout;
        this._onWarning  = onWarning || null;
        this._logoutTimer  = null;
        this._warningTimer = null;
        this._active = false;

        // Bound once so we can remove the exact same reference
        this._handleActivity = this._handleActivity.bind(this);
    }

    /** Start monitoring. Call after the user logs in. */
    start() {
        this._active = true;
        this._schedule();
        ACTIVITY_EVENTS.forEach(e =>
            window.addEventListener(e, this._handleActivity, { passive: true })
        );
    }

    /** Stop monitoring. Call on logout or page unload. */
    stop() {
        this._active = false;
        clearTimeout(this._logoutTimer);
        clearTimeout(this._warningTimer);
        ACTIVITY_EVENTS.forEach(e =>
            window.removeEventListener(e, this._handleActivity)
        );
    }

    /** Reset the timer (called automatically on any activity event). */
    _handleActivity() {
        if (!this._active) return;
        clearTimeout(this._logoutTimer);
        clearTimeout(this._warningTimer);
        this._schedule();
    }

    _schedule() {
        const warningDelay = this._timeoutMs - this._warningMs;

        if (this._onWarning && warningDelay > 0) {
            this._warningTimer = setTimeout(() => {
                if (this._active) this._onWarning();
            }, warningDelay);
        }

        this._logoutTimer = setTimeout(() => {
            if (this._active) {
                this.stop();
                this._onTimeout();
            }
        }, this._timeoutMs);
    }
}
