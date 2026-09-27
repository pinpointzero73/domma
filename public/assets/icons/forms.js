/**
 * Form icons - the marks that sit beside a form field (E.inputGroup, or a
 * field's formConfig.prefix / suffix): email, name, phone, address, money,
 * measurements. Same drawing rules as the rest of the set: 24px grid, 2px
 * round strokes, no fill. The Forms category also lists the existing icons
 * that suit a field (mail, user, phone, map-pin, calendar ...).
 */
const line = (path) => ({
    viewBox: '0 0 24 24',
    path,
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
});

export const forms = {
    // People
    'email': line('M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9h4'),
    'name': line('M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z M9 9a2 2 0 110 4 2 2 0 010-4z M6 16.5c.6-1.4 1.7-2 3-2s2.4.6 3 2 M15 10h3 M15 14h3'),
    'username': line('M12 2a10 10 0 110 20 10 10 0 010-20z M12 7a3 3 0 110 6 3 3 0 010-6z M6.2 18.3c1.3-1.9 3.4-3 5.8-3s4.5 1.1 5.8 3'),
    'password': line('M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z M7.5 12h.01 M12 12h.01 M16.5 12h.01'),
    'signature': line('M3 16c2.5-2.5 4.5-7 6.5-7 1.6 0-.6 6 1.2 6 1.4 0 2.6-3.5 4.3-3.5 1.4 0 .8 2.5 2.5 2.5 M3 20h18'),
    'birthday': line('M4 21h16 M5 21v-6a2 2 0 012-2h10a2 2 0 012 2v6 M5 17c1.2.9 2.3.9 3.5 0s2.3-.9 3.5 0 2.3.9 3.5 0 2.3-.9 3.5 0 M12 13V9 M12 7c-.9-.9-.9-2 0-3.5.9 1.5.9 2.6 0 3.5z'),
    'company': line('M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16 M16 9h2a2 2 0 012 2v10 M3 21h18 M8 7h4 M8 11h4 M8 15h4'),

    // Contact
    'telephone': line('M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z'),
    'mobile': line('M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z M11 18h2'),
    'address': line('M3 10.5L12 3l9 7.5 M5 9v12h14V9 M10 21v-6h4v6'),
    'postcode': line('M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z M10 9l-1 6 M14 9l-1 6 M7.5 11h8 M7 13h8'),
    'website': line('M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z M3 9h18 M6.5 6.5h.01 M9.5 6.5h.01'),

    // Money
    'pound': line('M17 7.5a4 4 0 00-7.5-1.5c-.8 1.5-.4 3.3 0 5 .5 2.2.4 4.5-1.5 7H18 M6.5 12.5h8'),
    'dollar': line('M12 2v20 M17 6.5C16.1 5 14.3 4.3 12 4.3 9 4.3 7 5.8 7 8c0 5 10 2.5 10 8 0 2.2-2 3.7-5 3.7-2.4 0-4.3-.8-5.2-2.3'),
    'euro': line('M18.5 6.5a7 7 0 100 11 M4 10h9 M4 14h9'),

    // Measurements
    'weight': line('M9 7a3 3 0 116 0 M6.5 9h11l2 12h-15l2-12z M10.5 14.5h3'),
    'ruler': line('M3 17L17 3l4 4L7 21l-4-4z M7 13l2 2 M10 10l2 2 M13 7l2 2'),
    'quantity': line('M4 6h16 M4 12h16 M4 18h10 M18 16v4 M16 18h4')
};

/** Existing icons that suit a form field, listed in the Forms category too. */
export const formsRelated = ['at-sign', 'mail', 'user', 'users', 'phone', 'smartphone', 'map-pin', 'home', 'calendar',
    'clock', 'lock', 'key', 'globe', 'link', 'credit-card', 'hash', 'percent', 'briefcase', 'building', 'message-square',
    'tag', 'search', 'cake', 'gift', 'scale'];

export default forms;
