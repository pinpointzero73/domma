/**
 * Programmatic Control - from public/showcase/elements/cookie-consent.
 */
export function mount(root) {
    let basicConsent, customConsent, positionConsent, apiConsent;
      // API example
    function initApiExample() {
        if (!apiConsent) {
          apiConsent = E.cookieConsent({
            message: 'API Example - Control this consent programmatically.',
            position: 'bottom-right',
            layout: 'box',
            privacyPolicyUrl: '#',
            storageKey: 'demo-api-consent',
            autoShow: false,
            reopenSelector: '[data-cookie-consent-open]'
          });
        }
      }
    function apiShow() {
        initApiExample();
        apiConsent.show();
        $(root).find('#api-output').text('Called: show()');
      }
    function apiHide() {
        initApiExample();
        apiConsent.hide();
        $(root).find('#api-output').text('Called: hide()');
      }
    function apiAccept() {
        initApiExample();
        apiConsent.accept();
        $(root).find('#api-output').text('Called: accept()\nState: ' + apiConsent.getState());
      }
    function apiReject() {
        initApiExample();
        apiConsent.reject();
        $(root).find('#api-output').text('Called: reject()\nState: ' + apiConsent.getState());
      }
    function apiCustomize() {
        initApiExample();
        apiConsent.showCustomize();
        $(root).find('#api-output').text('Called: showCustomize()');
      }
    function apiGetState() {
        initApiExample();
        const state = apiConsent.getState();
        $(root).find('#api-output').text('State: ' + state);
      }
    function apiGetPrefs() {
        initApiExample();
        const prefs = apiConsent.getPreferences();
        $(root).find('#api-output').text('Preferences:\n' + JSON.stringify(prefs, null, 2));
      }
    function apiReset() {
        initApiExample();
        apiConsent.reset();
        $(root).find('#api-output').text('Called: reset()\nState: ' + apiConsent.getState());
      }

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        apiShow();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        apiHide();
    });
    $(root).find('[data-action="3"]').on('click', function (event) {
        apiAccept();
    });
    $(root).find('[data-action="4"]').on('click', function (event) {
        apiReject();
    });
    $(root).find('[data-action="5"]').on('click', function (event) {
        apiCustomize();
    });
    $(root).find('[data-action="6"]').on('click', function (event) {
        apiGetState();
    });
    $(root).find('[data-action="7"]').on('click', function (event) {
        apiGetPrefs();
    });
    $(root).find('[data-action="8"]').on('click', function (event) {
        apiReset();
    });
}
