// Calculator Test Suite
// Run this in browser console: testCalculator()

function testCalculator() {
    console.log('🧪 Starting Calculator Tests...\n');

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    function test(name, testFn) {
        try {
            testFn();
            results.passed++;
            results.tests.push({name, status: '✅ PASS'});
            console.log(`✅ ${name}`);
        } catch (error) {
            results.failed++;
            results.tests.push({name, status: '❌ FAIL', error: error.message});
            console.error(`❌ ${name}: ${error.message}`);
        }
    }

    function clickButton(selector) {
        const btn = $(selector);
        if (btn.length === 0) throw new Error(`Button not found: ${selector}`);
        btn[0].click();
    }

    function getCurrentDisplay() {
        return $('#current-input').text().replace(/,/g, '');
    }

    function getPreviousDisplay() {
        return $('#previous-operation').text();
    }

    function resetCalc() {
        clickButton('[data-action="all-clear"]');
    }

    // Basic Mode Tests
    console.log('\n📱 BASIC MODE TESTS');

    test('Basic Mode: Number input (123)', () => {
        resetCalc();
        clickButton('[data-number="1"]');
        clickButton('[data-number="2"]');
        clickButton('[data-number="3"]');
        const display = getCurrentDisplay();
        if (display !== '123') throw new Error(`Expected 123, got ${display}`);
    });

    test('Basic Mode: Addition (5+3=8)', () => {
        resetCalc();
        clickButton('[data-number="5"]');
        clickButton('[data-action="add"]');
        clickButton('[data-number="3"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 8) throw new Error(`Expected 8, got ${result}`);
    });

    test('Basic Mode: Subtraction (10-4=6)', () => {
        resetCalc();
        clickButton('[data-number="1"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="subtract"]');
        clickButton('[data-number="4"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 6) throw new Error(`Expected 6, got ${result}`);
    });

    test('Basic Mode: Multiplication (7×8=56)', () => {
        resetCalc();
        clickButton('[data-number="7"]');
        clickButton('[data-action="multiply"]');
        clickButton('[data-number="8"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 56) throw new Error(`Expected 56, got ${result}`);
    });

    test('Basic Mode: Division (20÷4=5)', () => {
        resetCalc();
        clickButton('[data-number="2"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="divide"]');
        clickButton('[data-number="4"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 5) throw new Error(`Expected 5, got ${result}`);
    });

    test('Basic Mode: Decimal (1.5+2.5=4)', () => {
        resetCalc();
        clickButton('[data-number="1"]');
        clickButton('[data-action="decimal"]');
        clickButton('[data-number="5"]');
        clickButton('[data-action="add"]');
        clickButton('[data-number="2"]');
        clickButton('[data-action="decimal"]');
        clickButton('[data-number="5"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 4) throw new Error(`Expected 4, got ${result}`);
    });

    test('Basic Mode: Percentage (50%=0.5)', () => {
        resetCalc();
        clickButton('[data-number="5"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="percent"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 0.5) throw new Error(`Expected 0.5, got ${result}`);
    });

    test('Basic Mode: Clear (C)', () => {
        resetCalc();
        clickButton('[data-number="9"]');
        clickButton('[data-number="9"]');
        clickButton('[data-action="clear"]');
        const display = getCurrentDisplay();
        if (display !== '0') throw new Error(`Expected 0, got ${display}`);
    });

    test('Basic Mode: All Clear (AC)', () => {
        resetCalc();
        clickButton('[data-number="5"]');
        clickButton('[data-action="add"]');
        clickButton('[data-number="3"]');
        clickButton('[data-action="all-clear"]');
        const display = getCurrentDisplay();
        const prev = getPreviousDisplay();
        if (display !== '0' || prev !== '') throw new Error(`Expected cleared state`);
    });

    // Switch to Scientific Mode
    console.log('\n🔬 SCIENTIFIC MODE TESTS');
    clickButton('[data-mode="scientific"]');

    test('Scientific Mode: Mode switch', () => {
        if (!$('#scientific-buttons').is(':visible')) {
            throw new Error('Scientific buttons not visible');
        }
        if ($('#basic-buttons').is(':visible')) {
            throw new Error('Basic buttons still visible');
        }
    });

    test('Scientific Mode: Square root (√144=12)', () => {
        resetCalc();
        clickButton('[data-number="1"]');
        clickButton('[data-number="4"]');
        clickButton('[data-number="4"]');
        clickButton('[data-action="sqrt"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 12) throw new Error(`Expected 12, got ${result}`);
    });

    test('Scientific Mode: Square (5²=25)', () => {
        resetCalc();
        clickButton('[data-number="5"]');
        clickButton('[data-action="square"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 25) throw new Error(`Expected 25, got ${result}`);
    });

    test('Scientific Mode: Power (2^10=1024)', () => {
        resetCalc();
        clickButton('[data-number="2"]');
        clickButton('[data-action="power"]');
        clickButton('[data-number="1"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 1024) throw new Error(`Expected 1024, got ${result}`);
    });

    test('Scientific Mode: Reciprocal (1/4=0.25)', () => {
        resetCalc();
        clickButton('[data-number="4"]');
        clickButton('[data-action="reciprocal"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 0.25) throw new Error(`Expected 0.25, got ${result}`);
    });

    test('Scientific Mode: Natural log (ln(e)≈1)', () => {
        resetCalc();
        clickButton('[data-action="e"]');
        clickButton('[data-action="equals"]');
        clickButton('[data-action="ln"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - 1) > 0.0001) throw new Error(`Expected ~1, got ${result}`);
    });

    test('Scientific Mode: Log base 10 (log(1000)=3)', () => {
        resetCalc();
        clickButton('[data-number="1"]');
        clickButton('[data-number="0"]');
        clickButton('[data-number="0"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="log"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 3) throw new Error(`Expected 3, got ${result}`);
    });

    // Trigonometry Tests (DEG mode)
    test('Scientific Mode: sin(30°)=0.5', () => {
        resetCalc();
        // Ensure DEG mode
        if ($('[data-angle="deg"]').hasClass('active') === false) {
            clickButton('[data-angle="deg"]');
        }
        clickButton('[data-number="3"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="sin"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - 0.5) > 0.0001) throw new Error(`Expected 0.5, got ${result}`);
    });

    test('Scientific Mode: cos(60°)=0.5', () => {
        resetCalc();
        clickButton('[data-number="6"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="cos"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - 0.5) > 0.0001) throw new Error(`Expected 0.5, got ${result}`);
    });

    test('Scientific Mode: tan(45°)=1', () => {
        resetCalc();
        clickButton('[data-number="4"]');
        clickButton('[data-number="5"]');
        clickButton('[data-action="tan"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - 1) > 0.0001) throw new Error(`Expected 1, got ${result}`);
    });

    // Switch to RAD mode
    test('Scientific Mode: RAD mode switch', () => {
        clickButton('[data-angle="rad"]');
        if (!$('[data-angle="rad"]').hasClass('active')) {
            throw new Error('RAD mode not activated');
        }
    });

    test('Scientific Mode: sin(π/2)=1 in RAD', () => {
        resetCalc();
        clickButton('[data-action="pi"]');
        clickButton('[data-action="divide"]');
        clickButton('[data-number="2"]');
        clickButton('[data-action="equals"]');
        clickButton('[data-action="sin"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - 1) > 0.0001) throw new Error(`Expected 1, got ${result}`);
    });

    // Switch back to DEG
    clickButton('[data-angle="deg"]');

    // Inverse Trig Tests
    test('Scientific Mode: asin(0.5)=30°', () => {
        resetCalc();
        clickButton('[data-number="0"]');
        clickButton('[data-action="decimal"]');
        clickButton('[data-number="5"]');
        clickButton('[data-action="asin"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - 30) > 0.0001) throw new Error(`Expected 30, got ${result}`);
    });

    test('Scientific Mode: acos(0.5)=60°', () => {
        resetCalc();
        clickButton('[data-number="0"]');
        clickButton('[data-action="decimal"]');
        clickButton('[data-number="5"]');
        clickButton('[data-action="acos"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - 60) > 0.0001) throw new Error(`Expected 60, got ${result}`);
    });

    test('Scientific Mode: atan(1)=45°', () => {
        resetCalc();
        clickButton('[data-number="1"]');
        clickButton('[data-action="atan"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - 45) > 0.0001) throw new Error(`Expected 45, got ${result}`);
    });

    // Constants Tests
    test('Scientific Mode: Pi constant (π≈3.14159)', () => {
        resetCalc();
        clickButton('[data-action="pi"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - Math.PI) > 0.0001) throw new Error(`Expected π, got ${result}`);
    });

    test('Scientific Mode: Euler constant (e≈2.71828)', () => {
        resetCalc();
        clickButton('[data-action="e"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - Math.E) > 0.0001) throw new Error(`Expected e, got ${result}`);
    });

    // Expression Tests
    test('Scientific Mode: Expression (5+3)×2=16', () => {
        resetCalc();
        clickButton('[data-action="paren-open"]');
        clickButton('[data-number="5"]');
        clickButton('[data-action="add"]');
        clickButton('[data-number="3"]');
        clickButton('[data-action="paren-close"]');
        clickButton('[data-action="multiply"]');
        clickButton('[data-number="2"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 16) throw new Error(`Expected 16, got ${result}`);
    });

    test('Scientific Mode: Expression π×2≈6.28318', () => {
        resetCalc();
        clickButton('[data-action="pi"]');
        clickButton('[data-action="multiply"]');
        clickButton('[data-number="2"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (Math.abs(result - (Math.PI * 2)) > 0.0001) throw new Error(`Expected ${Math.PI * 2}, got ${result}`);
    });

    test('Scientific Mode: Percentage in expression (50/100=0.5)', () => {
        resetCalc();
        clickButton('[data-number="5"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="percent"]');
        clickButton('[data-action="equals"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 0.5) throw new Error(`Expected 0.5, got ${result}`);
    });

    // Memory Tests
    test('Scientific Mode: Memory Add (M+)', () => {
        resetCalc();
        clickButton('[data-number="1"]');
        clickButton('[data-number="0"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="m-plus"]');
        if ($('#memory-indicator').length === 0) {
            throw new Error('Memory indicator not shown');
        }
    });

    test('Scientific Mode: Memory Recall (MR)', () => {
        // Memory should have 100 from previous test
        resetCalc();
        clickButton('[data-action="mr"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 100) throw new Error(`Expected 100, got ${result}`);
    });

    test('Scientific Mode: Memory Subtract (M-)', () => {
        resetCalc();
        clickButton('[data-number="5"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="m-minus"]');
        clickButton('[data-action="mr"]');
        const result = parseFloat(getCurrentDisplay());
        if (result !== 50) throw new Error(`Expected 50, got ${result}`);
    });

    test('Scientific Mode: Memory Clear (MC)', () => {
        clickButton('[data-action="mc"]');
        if ($('#memory-indicator').length !== 0) {
            throw new Error('Memory indicator still shown');
        }
    });

    // Error Handling Tests
    console.log('\n⚠️  ERROR HANDLING TESTS');

    test('Error: Division by zero', () => {
        resetCalc();
        clickButton('[data-number="5"]');
        clickButton('[data-action="divide"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="equals"]');
        // Should show error toast
        const display = getCurrentDisplay();
        if (display === 'Infinity' || display === 'NaN') {
            throw new Error('Should have shown error, not result');
        }
    });

    test('Error: Square root of negative', () => {
        resetCalc();
        clickButton('[data-number="5"]');
        clickButton('[data-action="subtract"]');
        clickButton('[data-number="1"]');
        clickButton('[data-number="0"]');
        clickButton('[data-action="equals"]');
        clickButton('[data-action="sqrt"]');
        // Should show error toast
        const display = getCurrentDisplay();
        if (display !== '-5') {
            throw new Error('Should have rejected sqrt of negative');
        }
    });

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Total:  ${results.passed + results.failed}`);
    console.log(`✨ Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));

    if (results.failed > 0) {
        console.log('\n❌ FAILED TESTS:');
        results.tests.filter(t => t.status.includes('FAIL')).forEach(t => {
            console.log(`  • ${t.name}: ${t.error}`);
        });
    }

    return results;
}

// Auto-run if script is loaded
console.log('Calculator test suite loaded. Run testCalculator() to start tests.');
