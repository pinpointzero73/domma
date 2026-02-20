/**
 * DommaCom: domma-calculator
 *
 * A fully self-contained calculator Web Component built with Domma.component().
 * Demonstrates: reactive data, computed properties, Shadow DOM event delegation,
 * keyboard support, and lifecycle hooks.
 *
 * Usage:
 *   <domma-calculator></domma-calculator>
 *   <domma-calculator initial-mode="scientific"></domma-calculator>
 */

Domma.component('domma-calculator', {
    templateUrl: 'template.html',

    props: {
        initialMode: { type: 'string', default: 'basic' }
    },

    data() {
        return {
            currentInput: '0',
            previousInput: '',
            operation: null,
            shouldResetScreen: false,
            mode: 'basic',
            angleMode: 'deg',
            memory: 0
        };
    },

    computed: {
        /** Formatted display value with locale-aware thousands separators. */
        formattedDisplay() {
            return this._fmt(this.data.currentInput);
        },

        /** Previous operation line shown above the main display. */
        previousOperation() {
            const { previousInput, operation } = this.data;
            if (operation && previousInput) {
                return this._fmt(previousInput) + ' ' + operation;
            }
            return '';
        },

        /** True when memory register is non-zero (shows "M" indicator). */
        hasMemory() {
            return this.data.memory !== 0;
        },

        /** True when scientific mode is active. */
        isScientific() {
            return this.data.mode === 'scientific';
        }
    },

    methods: {
        /** Format a numeric string with locale separators. */
        _fmt(num) {
            const s = String(num || '0');
            if (s.includes('.')) {
                const [whole, dec] = s.split('.');
                const n = parseInt(whole);
                return (isNaN(n) ? whole : n.toLocaleString()) + '.' + dec;
            }
            const n = parseInt(s || '0');
            return isNaN(n) ? s : n.toLocaleString();
        },

        appendNumber(number) {
            const { currentInput, shouldResetScreen } = this.data;
            if (String(currentInput).length >= 12 && !shouldResetScreen) {
                E.toast('Maximum digits reached', { type: 'warning' });
                return;
            }
            const newInput = shouldResetScreen
                ? String(number)
                : (currentInput === '0' ? String(number) : currentInput + number);
            this.set({ currentInput: newInput, shouldResetScreen: false });
        },

        appendDecimal() {
            const { currentInput, shouldResetScreen } = this.data;
            if (shouldResetScreen) {
                this.set({ currentInput: '0.', shouldResetScreen: false });
            } else if (!currentInput.includes('.')) {
                this.set({ currentInput: currentInput + '.' });
            }
        },

        chooseOperation(op) {
            const { currentInput, previousInput, shouldResetScreen } = this.data;
            if (currentInput === '') return;
            if (previousInput !== '' && !shouldResetScreen) {
                this.calculate();
            }
            this.set({ operation: op, previousInput: this.data.currentInput, shouldResetScreen: true });
        },

        calculate() {
            const { operation, previousInput, currentInput } = this.data;
            if (!operation || previousInput === '') return;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            let result;
            switch (operation) {
                case '+': result = prev + current; break;
                case '−': result = prev - current; break;
                case '×': result = prev * current; break;
                case '÷':
                    if (current === 0) {
                        E.toast('Cannot divide by zero', { type: 'danger' });
                        this.allClear();
                        return;
                    }
                    result = prev / current;
                    break;
                case '%': result = prev * (current / 100); break;
                case '^': result = Math.pow(prev, current); break;
                default: return;
            }
            result = Math.round(result * 100000000) / 100000000;
            this.set({
                currentInput: String(result),
                operation: null,
                previousInput: '',
                shouldResetScreen: true
            });
        },

        clear() {
            this.set({ currentInput: '0' });
        },

        allClear() {
            this.set({
                currentInput: '0',
                previousInput: '',
                operation: null,
                shouldResetScreen: false
            });
        },

        handlePercent() {
            const { currentInput, operation, previousInput } = this.data;
            const current = parseFloat(currentInput);
            const result = (operation && previousInput !== '')
                ? parseFloat(previousInput) * (current / 100)
                : current / 100;
            this.set({ currentInput: String(result) });
        },

        switchMode(newMode) {
            this.set({ mode: newMode });
            this.allClear();
        },

        toggleAngleMode(angle) {
            this.set({ angleMode: angle });
        },

        /** Insert a mathematical constant into the display. */
        insertConstant(constant) {
            const value = constant === 'pi' ? Math.PI : Math.E;
            const valueStr = String(Math.round(value * 100000000) / 100000000);
            const { currentInput, shouldResetScreen } = this.data;
            if (shouldResetScreen || currentInput === '0') {
                this.set({ currentInput: valueStr, shouldResetScreen: false });
            } else {
                this.set({ currentInput: currentInput + valueStr });
            }
        },

        /** Update active CSS class on mode/angle toggle buttons. */
        _updateActiveBtns() {
            const { mode, angleMode } = this.data;
            this.root.querySelectorAll('.mode-btn').forEach(b =>
                b.classList.toggle('active', b.dataset.mode === mode)
            );
            this.root.querySelectorAll('.angle-btn').forEach(b =>
                b.classList.toggle('active', b.dataset.angle === angleMode)
            );
        },

        handleScientificFunction(func) {
            const { currentInput, angleMode } = this.data;
            const v = parseFloat(currentInput);
            const toRad = angleMode === 'deg' ? (x) => x * Math.PI / 180 : (x) => x;
            const fromRad = angleMode === 'deg' ? (x) => x * 180 / Math.PI : (x) => x;
            let r;
            switch (func) {
                case 'sin': r = Math.sin(toRad(v)); break;
                case 'cos': r = Math.cos(toRad(v)); break;
                case 'tan': r = Math.tan(toRad(v)); break;
                case 'asin':
                    if (v < -1 || v > 1) { E.toast('Invalid input for asin', { type: 'danger' }); return; }
                    r = fromRad(Math.asin(v)); break;
                case 'acos':
                    if (v < -1 || v > 1) { E.toast('Invalid input for acos', { type: 'danger' }); return; }
                    r = fromRad(Math.acos(v)); break;
                case 'atan': r = fromRad(Math.atan(v)); break;
                case 'sqrt':
                    if (v < 0) { E.toast('Cannot take square root of negative number', { type: 'danger' }); return; }
                    r = Math.sqrt(v); break;
                case 'square': r = v * v; break;
                case 'reciprocal':
                    if (v === 0) { E.toast('Cannot divide by zero', { type: 'danger' }); return; }
                    r = 1 / v; break;
                case 'ln':
                    if (v <= 0) { E.toast('Cannot compute ln of non-positive number', { type: 'danger' }); return; }
                    r = Math.log(v); break;
                case 'log':
                    if (v <= 0) { E.toast('Cannot compute log of non-positive number', { type: 'danger' }); return; }
                    r = Math.log10(v); break;
                default: return;
            }
            this.set({ currentInput: String(Math.round(r * 100000000) / 100000000), shouldResetScreen: true });
        },

        memoryAdd()      { this.set({ memory: this.data.memory + parseFloat(this.data.currentInput) }); },
        memorySubtract() { this.set({ memory: this.data.memory - parseFloat(this.data.currentInput) }); },
        memoryRecall() {
            if (this.data.memory === 0) { E.toast('Memory is empty', { type: 'warning' }); return; }
            this.set({ currentInput: String(this.data.memory), shouldResetScreen: true });
        },
        memoryClear() { this.set({ memory: 0 }); },

        /** Dispatch an action by name — single handler for all [data-action] buttons. */
        handleAction(action) {
            switch (action) {
                case 'clear':       this.clear(); break;
                case 'all-clear':   this.allClear(); break;
                case 'decimal':     this.appendDecimal(); break;
                case 'equals':      this.calculate(); break;
                case 'percent':     this.handlePercent(); break;
                case 'add':         this.chooseOperation('+'); break;
                case 'subtract':    this.chooseOperation('−'); break;
                case 'multiply':    this.chooseOperation('×'); break;
                case 'divide':      this.chooseOperation('÷'); break;
                case 'power':       this.chooseOperation('^'); break;
                case 'm-plus':      this.memoryAdd(); break;
                case 'm-minus':     this.memorySubtract(); break;
                case 'mr':          this.memoryRecall(); break;
                case 'mc':          this.memoryClear(); break;
                case 'pi':          this.insertConstant('pi'); break;
                case 'e':           this.insertConstant('e'); break;
                case 'angle-toggle': {
                    const newAngle = this.data.angleMode === 'deg' ? 'rad' : 'deg';
                    this.toggleAngleMode(newAngle);
                    break;
                }
                case 'sin': case 'cos': case 'tan':
                case 'asin': case 'acos': case 'atan':
                case 'sqrt': case 'square': case 'reciprocal':
                case 'ln': case 'log':
                    this.handleScientificFunction(action);
                    break;
            }
        },

        handleKeyboard(e) {
            if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
            else if (e.key === '.') this.appendDecimal();
            else if (e.key === '+') this.chooseOperation('+');
            else if (e.key === '-') this.chooseOperation('−');
            else if (e.key === '*') this.chooseOperation('×');
            else if (e.key === '/') { e.preventDefault(); this.chooseOperation('÷'); }
            else if (e.key === '%') this.handlePercent();
            else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); this.calculate(); }
            else if (e.key === 'Escape') this.allClear();
            else if (e.key === 'Backspace') this.clear();
        }
    },

    onMount() {
        // Apply initial mode from prop
        if (this.props.initialMode && this.props.initialMode !== 'basic') {
            this.set({ mode: this.props.initialMode });
        }

        // Single delegated click handler — attached to the shadow root so it survives re-renders
        this.root.addEventListener('click', (e) => {
            const numBtn = e.target.closest('[data-number]');
            if (numBtn) { this.appendNumber(numBtn.dataset.number); return; }

            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) { this.handleAction(actionBtn.dataset.action); return; }

            const modeBtn = e.target.closest('[data-mode]');
            if (modeBtn) { this.switchMode(modeBtn.dataset.mode); return; }

            const angleBtn = e.target.closest('[data-angle]');
            if (angleBtn) { this.toggleAngleMode(angleBtn.dataset.angle); return; }
        });

        // Keyboard support — attached to document, removed in onUnmount
        this._keyHandler = (e) => this.handleKeyboard(e);
        document.addEventListener('keydown', this._keyHandler);

        this._updateActiveBtns();
        I.scan(this.root);
    },

    onUpdated() {
        // Re-scan icons and refresh button states after every re-render
        I.scan(this.root);
        this._updateActiveBtns();
    },

    onUnmount() {
        if (this._keyHandler) {
            document.removeEventListener('keydown', this._keyHandler);
        }
    },

    style: `
        :host { display: block; }

        .calculator-wrapper { max-width: 400px; margin: 0 auto; }

        .calculator-card {
            background: var(--dm-card-bg);
            border: 1px solid var(--dm-border);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: var(--dm-shadow-md);
        }

        .calculator-display {
            background: var(--dm-surface);
            border: 2px solid var(--dm-border);
            border-radius: 8px;
            padding: 1.5rem 1rem;
            margin-bottom: 1rem;
            text-align: right;
            min-height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            position: relative;
        }

        .calculator-previous { font-size: 0.875rem; color: var(--dm-text-muted); min-height: 1.25rem; }
        .calculator-current  { font-size: 2rem; font-weight: 600; color: var(--dm-text); overflow-wrap: break-word; }

        .calculator-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }

        .calc-btn {
            padding: 1.25rem;
            font-size: 1.25rem;
            font-weight: 600;
            border: 1px solid var(--dm-border);
            border-radius: 8px;
            background: var(--dm-card-bg);
            color: var(--dm-text);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .calc-btn:hover { background: var(--dm-hover-bg); transform: translateY(-2px); box-shadow: var(--dm-shadow-md); }
        .calc-btn:active { transform: translateY(0); }

        .calc-btn-operator  { background: var(--dm-primary-light, #dbeafe); color: var(--dm-primary-dark, #1d4ed8); font-weight: 700; }
        .calc-btn-operator:hover { background: var(--dm-primary); color: var(--dm-white); }

        .calc-btn-equals    { background: var(--dm-success); color: var(--dm-white); grid-column: span 2; }
        .calc-btn-equals:hover { background: var(--dm-success-dark, #15803d); }

        .calc-btn-clear     { background: var(--dm-danger-light, #fee2e2); color: var(--dm-danger-dark, #b91c1c); }
        .calc-btn-clear:hover { background: var(--dm-danger); color: var(--dm-white); }

        .calculator-mode-toggle { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1rem; }

        .mode-btn {
            padding: 0.5rem 1.5rem;
            border: 1px solid var(--dm-border);
            border-radius: 8px;
            background: var(--dm-card-bg);
            color: var(--dm-text);
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.95rem;
            font-weight: 500;
        }

        .mode-btn.active { background: var(--dm-primary); color: var(--dm-white); border-color: var(--dm-primary); }
        .mode-btn:hover:not(.active) { background: var(--dm-hover-bg); }

        .angle-mode-toggle { display: flex; gap: 0.25rem; margin-bottom: 0.5rem; }

        .angle-btn {
            flex: 1;
            padding: 0.35rem;
            font-size: 0.75rem;
            font-weight: 600;
            border: 1px solid var(--dm-border);
            border-radius: 4px;
            background: var(--dm-surface);
            color: var(--dm-text-muted);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .angle-btn.active { background: var(--dm-info); color: var(--dm-white); border-color: var(--dm-info); }
        .angle-btn:hover:not(.active) { background: var(--dm-hover-bg); }

        .calculator-buttons-scientific { display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.35rem; }
        .calculator-buttons-scientific .calc-btn { padding: 0.9rem 0.5rem; font-size: 0.9rem; }
        .calculator-wrapper.scientific-mode { max-width: 650px; transition: max-width 0.3s ease; }

        .calc-btn-function  { background: var(--dm-info-light, #e0f2fe); color: var(--dm-info-dark, #075985); font-size: 0.85rem; font-weight: 600; }
        .calc-btn-function:hover { background: var(--dm-info); color: var(--dm-white); }

        .calc-btn-memory    { background: var(--dm-warning-light, #fef3c7); color: var(--dm-warning-dark, #92400e); font-size: 0.85rem; font-weight: 600; }
        .calc-btn-memory:hover { background: var(--dm-warning); color: var(--dm-white); }

        .calc-btn-constant  { background: var(--dm-success-light, #dcfce7); color: var(--dm-success-dark, #15803d); font-weight: 700; font-size: 1.1rem; }
        .calc-btn-constant:hover { background: var(--dm-success); color: var(--dm-white); }

        .memory-indicator {
            position: absolute;
            top: 0.5rem; left: 0.5rem;
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--dm-warning);
            background: var(--dm-warning-light, #fef3c7);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
        }
    `
});
