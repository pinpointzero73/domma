(function () {
    'use strict';

    // ========================================
    // Configuration
    // ========================================

    const OPERATORS = {
        ADD: '+',
        SUBTRACT: '−',
        MULTIPLY: '×',
        DIVIDE: '÷',
        PERCENT: '%'
    };

    const MAX_DIGITS = 12;

    // ========================================
    // State Management
    // ========================================

    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetScreen = false;
    let mode = 'basic';           // 'basic' or 'scientific'
    let angleMode = 'deg';        // 'deg' or 'rad'
    let memory = 0;               // Memory storage
    let expression = '';          // For expression mode
    let useExpression = false;    // Track if we're building an expression

    // ========================================
    // Display Updates
    // ========================================

    function updateDisplay() {
        $('#current-input').text(formatNumber(currentInput));

        if (operation && previousInput) {
            $('#previous-operation').text(`${formatNumber(previousInput)} ${operation}`);
        } else {
            $('#previous-operation').text('');
        }
    }

    function formatNumber(num) {
        if (num.includes('.')) {
            const [whole, decimal] = num.split('.');
            return `${parseInt(whole).toLocaleString()}.${decimal}`;
        }
        return parseInt(num || 0).toLocaleString();
    }

    // ========================================
    // Calculator Operations
    // ========================================

    function appendNumber(number) {
        if (currentInput.length >= MAX_DIGITS) {
            showError('Maximum digits reached');
            return;
        }

        if (shouldResetScreen) {
            currentInput = String(number);
            shouldResetScreen = false;
        } else {
            currentInput = currentInput === '0'
                ? String(number)
                : currentInput + number;
        }

        updateDisplay();
    }

    function appendDecimal() {
        if (shouldResetScreen) {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }

        updateDisplay();
    }

    function chooseOperation(op) {
        if (currentInput === '') return;

        if (previousInput !== '' && !shouldResetScreen) {
            calculate();
        }

        operation = op;
        previousInput = currentInput;
        shouldResetScreen = true;
        updateDisplay();
    }

    function calculate() {
        if (!operation || previousInput === '') return;

        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;

        switch (operation) {
            case OPERATORS.ADD:
                result = prev + current;
                break;
            case OPERATORS.SUBTRACT:
                result = prev - current;
                break;
            case OPERATORS.MULTIPLY:
                result = prev * current;
                break;
            case OPERATORS.DIVIDE:
                if (current === 0) {
                    showError('Cannot divide by zero');
                    clear();
                    return;
                }
                result = prev / current;
                break;
            case OPERATORS.PERCENT:
                result = prev * (current / 100);
                break;
            case '^':
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }

        // Handle floating point precision
        result = Math.round(result * 100000000) / 100000000;

        currentInput = String(result);
        operation = null;
        previousInput = '';
        shouldResetScreen = true;
        updateDisplay();
    }

    function clear() {
        currentInput = '0';
        updateDisplay();
    }

    function allClear() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        shouldResetScreen = false;
        updateDisplay();
    }

    function handlePercent() {
        if (mode === 'scientific') {
            // In scientific mode, use expression mode for percentage
            if (!useExpression) {
                expression = currentInput === '0' ? '' : currentInput;
                useExpression = true;
            }
            expression += '/100';
            currentInput = expression;
            updateDisplay();
        } else {
            // In basic mode, simple percentage conversion
            const current = parseFloat(currentInput);
            currentInput = String(current / 100);
            updateDisplay();
        }
    }

    function showError(message) {
        // Create a simple toast notification
        const toast = $('<div class="calc-toast"></div>').text(message);
        $('body').append(toast);

        // Trigger animation
        setTimeout(() => toast.addClass('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // Mode Toggle
    // ========================================

    function switchMode(newMode) {
        mode = newMode;

        // Update UI
        $('.mode-btn').removeClass('active');
        $(`.mode-btn[data-mode="${newMode}"]`).addClass('active');

        if (newMode === 'scientific') {
            $('#basic-buttons').hide();
            $('#scientific-buttons').show();
            $('#angle-mode-toggle').show();
            $('.calculator-wrapper').addClass('scientific-mode');
        } else {
            $('#basic-buttons').show();
            $('#scientific-buttons').hide();
            $('#angle-mode-toggle').hide();
            $('.calculator-wrapper').removeClass('scientific-mode');
        }

        // Reset calculator when switching modes
        allClear();
    }

    function toggleAngleMode(newAngle) {
        angleMode = newAngle;
        $('.angle-btn').removeClass('active');
        $(`.angle-btn[data-angle="${angleMode}"]`).addClass('active');
        $('[data-action="angle-toggle"]').text(angleMode.toUpperCase());
    }

    // ========================================
    // Scientific Functions
    // ========================================

    function handleScientificFunction(func) {
        const current = parseFloat(currentInput);
        let result;

        switch (func) {
            case 'sin':
                result = angleMode === 'deg'
                    ? Math.sin(current * Math.PI / 180)
                    : Math.sin(current);
                break;
            case 'cos':
                result = angleMode === 'deg'
                    ? Math.cos(current * Math.PI / 180)
                    : Math.cos(current);
                break;
            case 'tan':
                result = angleMode === 'deg'
                    ? Math.tan(current * Math.PI / 180)
                    : Math.tan(current);
                break;
            case 'asin':
                if (current < -1 || current > 1) {
                    showError('Invalid input for asin');
                    return;
                }
                result = Math.asin(current);
                result = angleMode === 'deg' ? result * 180 / Math.PI : result;
                break;
            case 'acos':
                if (current < -1 || current > 1) {
                    showError('Invalid input for acos');
                    return;
                }
                result = Math.acos(current);
                result = angleMode === 'deg' ? result * 180 / Math.PI : result;
                break;
            case 'atan':
                result = Math.atan(current);
                result = angleMode === 'deg' ? result * 180 / Math.PI : result;
                break;
            case 'sqrt':
                if (current < 0) {
                    showError('Cannot calculate square root of negative number');
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'square':
                result = current * current;
                break;
            case 'reciprocal':
                if (current === 0) {
                    showError('Cannot divide by zero');
                    return;
                }
                result = 1 / current;
                break;
            case 'ln':
                if (current <= 0) {
                    showError('Cannot calculate ln of non-positive number');
                    return;
                }
                result = Math.log(current);
                break;
            case 'log':
                if (current <= 0) {
                    showError('Cannot calculate log of non-positive number');
                    return;
                }
                result = Math.log10(current);
                break;
        }

        currentInput = String(Math.round(result * 100000000) / 100000000);
        shouldResetScreen = true;
        updateDisplay();
    }

    // ========================================
    // Memory Functions
    // ========================================

    function memoryAdd() {
        memory += parseFloat(currentInput);
        showMemoryIndicator();
    }

    function memorySubtract() {
        memory -= parseFloat(currentInput);
        showMemoryIndicator();
    }

    function memoryRecall() {
        if (memory === 0) {
            showError('Memory is empty');
            return;
        }
        currentInput = String(memory);
        shouldResetScreen = true;
        updateDisplay();
    }

    function memoryClear() {
        memory = 0;
        hideMemoryIndicator();
    }

    function showMemoryIndicator() {
        if (!$('#memory-indicator').length) {
            $('.calculator-display').prepend('<div id="memory-indicator" class="memory-indicator">M</div>');
        }
    }

    function hideMemoryIndicator() {
        $('#memory-indicator').remove();
    }

    // ========================================
    // Expression Mode Functions
    // ========================================

    function appendToExpression(char) {
        if (shouldResetScreen) {
            expression = '';
            currentInput = '';
            shouldResetScreen = false;
        }

        if (!useExpression) {
            expression = currentInput === '0' ? '' : currentInput;
            useExpression = true;
        }

        expression += char;
        currentInput = expression;
        updateDisplay();
    }

    function handleParentheses(type) {
        appendToExpression(type === 'open' ? '(' : ')');
    }

    function handleConstant(constant) {
        const symbol = constant === 'pi' ? 'π' : 'e';
        const value = constant === 'pi' ? Math.PI : Math.E;
        const valueStr = String(Math.round(value * 100000000) / 100000000);

        // In scientific mode, always use symbols and expression mode
        if (mode === 'scientific') {
            if (!useExpression) {
                expression = currentInput === '0' ? '' : currentInput;
                useExpression = true;
            }
            expression += symbol;
            currentInput = expression;
        } else if (shouldResetScreen) {
            currentInput = valueStr;
            shouldResetScreen = false;
        } else {
            currentInput = currentInput === '0' ? valueStr : currentInput + valueStr;
        }

        updateDisplay();
    }

    function handlePower() {
        if (useExpression) {
            expression += '^';
            currentInput = expression;
            updateDisplay();
        } else {
            chooseOperation('^');
        }
    }

    function calculateExpression() {
        if (!useExpression && operation) {
            calculate(); // Fall back to basic calculation
            return;
        }

        if (!useExpression) {
            return;
        }

        const result = evaluateExpression(expression);
        if (result !== null) {
            currentInput = String(result);
            previousInput = expression;
            operation = '=';
            expression = '';
            useExpression = false;
            shouldResetScreen = true;
            updateDisplay();
        }
    }

    function evaluateExpression(expr) {
        try {
            // Replace calculator symbols with JavaScript operators
            expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\^/g, '**');

            // Handle special constants
            expr = expr.replace(/π/g, Math.PI);
            const ePattern = /(?<![a-z])e(?![a-z])/g;
            expr = expr.replace(ePattern, Math.E);

            // Handle scientific functions with regex
            const funcMap = {
                'sin': (val) => angleMode === 'deg' ? Math.sin(val * Math.PI / 180) : Math.sin(val),
                'cos': (val) => angleMode === 'deg' ? Math.cos(val * Math.PI / 180) : Math.cos(val),
                'tan': (val) => angleMode === 'deg' ? Math.tan(val * Math.PI / 180) : Math.tan(val),
                'asin': (val) => {
                    const result = Math.asin(val);
                    return angleMode === 'deg' ? result * 180 / Math.PI : result;
                },
                'acos': (val) => {
                    const result = Math.acos(val);
                    return angleMode === 'deg' ? result * 180 / Math.PI : result;
                },
                'atan': (val) => {
                    const result = Math.atan(val);
                    return angleMode === 'deg' ? result * 180 / Math.PI : result;
                },
                'sqrt': (val) => Math.sqrt(val),
                'ln': (val) => Math.log(val),
                'log': (val) => Math.log10(val)
            };

            // Replace function calls
            for (const [func, fn] of Object.entries(funcMap)) {
                const regex = new RegExp(`${func}\\(([^)]+)\\)`, 'g');
                expr = expr.replace(regex, (match, val) => {
                    try {
                        const numVal = eval(val);
                        return fn(numVal);
                    } catch (e) {
                        throw new Error(`Invalid ${func} argument`);
                    }
                });
            }

            // Evaluate the expression
            const result = eval(expr);

            // Check for invalid results
            if (isNaN(result) || !isFinite(result)) {
                throw new Error('Invalid result');
            }

            // Handle floating point precision
            return Math.round(result * 100000000) / 100000000;
        } catch (error) {
            showError('Invalid expression');
            return null;
        }
    }

    // ========================================
    // Event Handlers
    // ========================================

    function initEventHandlers() {
        // Number buttons
        $('[data-number]').on('click', (e) => {
            const number = $(e.currentTarget).attr('data-number');
            appendNumber(number);
        });

        // Action buttons
        $('[data-action]').on('click', (e) => {
            const action = $(e.currentTarget).attr('data-action');

            switch (action) {
                case 'clear':
                    clear();
                    break;
                case 'all-clear':
                    allClear();
                    break;
                case 'decimal':
                    appendDecimal();
                    break;
                case 'equals':
                    if (useExpression) {
                        calculateExpression();
                    } else {
                        calculate();
                    }
                    break;
                case 'percent':
                    handlePercent();
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    const operatorSymbol = $(e.currentTarget).text();
                    chooseOperation(operatorSymbol);
                    break;
            }
        });

        // Mode toggle
        $('.mode-btn').on('click', (e) => {
            const newMode = $(e.currentTarget).attr('data-mode');
            switchMode(newMode);
        });

        // Angle mode toggle
        $('.angle-btn').on('click', (e) => {
            const angle = $(e.currentTarget).attr('data-angle');
            toggleAngleMode(angle);
        });

        // Scientific functions
        $('[data-action="sin"], [data-action="cos"], [data-action="tan"], [data-action="asin"], [data-action="acos"], [data-action="atan"], [data-action="sqrt"], [data-action="square"], [data-action="reciprocal"], [data-action="ln"], [data-action="log"]').on('click', (e) => {
            const func = $(e.currentTarget).attr('data-action');
            handleScientificFunction(func);
        });

        // Memory functions
        $('[data-action="m-plus"]').on('click', memoryAdd);
        $('[data-action="m-minus"]').on('click', memorySubtract);
        $('[data-action="mr"]').on('click', memoryRecall);
        $('[data-action="mc"]').on('click', memoryClear);

        // Constants
        $('[data-action="pi"]').on('click', () => handleConstant('pi'));
        $('[data-action="e"]').on('click', () => handleConstant('e'));

        // Parentheses
        $('[data-action="paren-open"]').on('click', () => handleParentheses('open'));
        $('[data-action="paren-close"]').on('click', () => handleParentheses('close'));

        // Power function
        $('[data-action="power"]').on('click', handlePower);

        // Keyboard support
        $(document).on('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                appendNumber(e.key);
            } else if (e.key === '.') {
                appendDecimal();
            } else if (e.key === '+') {
                chooseOperation(OPERATORS.ADD);
            } else if (e.key === '-') {
                chooseOperation(OPERATORS.SUBTRACT);
            } else if (e.key === '*') {
                chooseOperation(OPERATORS.MULTIPLY);
            } else if (e.key === '/') {
                e.preventDefault();
                chooseOperation(OPERATORS.DIVIDE);
            } else if (e.key === '%') {
                handlePercent();
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                if (useExpression) {
                    calculateExpression();
                } else {
                    calculate();
                }
            } else if (e.key === 'Escape') {
                allClear();
            } else if (e.key === 'Backspace') {
                clear();
            }
        });
    }

    // ========================================
    // Initialization
    // ========================================

    function init() {
        updateDisplay();
        initEventHandlers();
        Domma.icons.scan();
    }

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
