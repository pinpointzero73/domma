/**
 * Address Lookup Admin — Overview Dashboard
 */

import AdminAuth from '../shared/admin-auth.js';
import { getApiUrl, formatDate, initALSidebar } from './shared/al-sidebar.js';

const API_URL = getApiUrl();

/** Activity table instance (T.create keeps state across reloads). */
let activityTable = null;

/**
 * Initialise the page.
 */
async function init() {
    if (!AdminAuth.init(API_URL, ['admin'])) {
        return;
    }

    initALSidebar('overview');

    await loadDashboardStats();

    initSearchTabs();
    initTestLookup();

    $('body').removeClass('dm-cloaked');
}

/**
 * Load dashboard statistics from the API.
 */
async function loadDashboardStats() {
    try {
        const response = await Domma.http.get(`${API_URL}/address/admin/address-lookup/stats`, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (response.success && response.stats) {
            renderStats(response.stats);
        } else {
            throw new Error(response.message || 'Failed to load statistics');
        }
    } catch (error) {
        console.error('[AddressLookupAdmin] Failed to load stats:', error);
        Domma.elements.toast('Failed to load dashboard statistics', { type: 'error' });

        renderStats({
            totalUsers: 0,
            totalLookups: { total: 0, free: 0, premium: 0 },
            credits: { purchased: 0, consumed: 0, remaining: 0 },
            cacheStats: { hitRate: 0, hits: 0, misses: 0 },
            activeApiKeys: 0,
            recentActivity: []
        });
    }
}

/**
 * Render statistics to the dashboard.
 */
function renderStats(stats) {
    $('#stat-total-users').text(stats.totalUsers.toLocaleString());

    $('#stat-total-lookups').text(stats.totalLookups.total.toLocaleString());
    $('#stat-free-lookups').text(`${stats.totalLookups.free.toLocaleString()} free`);
    $('#stat-premium-lookups').text(`${stats.totalLookups.premium.toLocaleString()} premium`);

    $('#stat-credits-purchased').text(stats.credits.purchased.toLocaleString());
    $('#stat-credits-consumed').text(stats.credits.consumed.toLocaleString());
    $('#stat-credits-remaining').text(stats.credits.remaining.toLocaleString());

    const hitRatePercent = stats.cacheStats.hitRate.toFixed(1);
    $('#stat-cache-hit-rate').text(`${hitRatePercent}%`);
    $('#stat-cache-hits').text(`${stats.cacheStats.hits.toLocaleString()} hits`);
    $('#stat-cache-misses').text(`${stats.cacheStats.misses.toLocaleString()} misses`);

    $('#stat-active-keys').text(stats.activeApiKeys.toLocaleString());

    renderActivityTable(stats.recentActivity);
}

/**
 * Render recent activity using T.create().
 */
function renderActivityTable(activities) {
    const tableData = (activities || []).map(a => ({
        userEmail:  a.userEmail || 'Unknown',
        action:     a.action    || '-',
        postcode:   a.postcode  || '-',
        tier:       a.tier      || '-',
        cacheHit:   a.cacheHit,
        createdAt:  a.createdAt
    }));

    if (!activityTable) {
        activityTable = T.create('#activity-table', {
            data: tableData,
            columns: [
                { key: 'userEmail', title: 'User',    sortable: true },
                {
                    key: 'action',
                    title: 'Action',
                    sortable: true,
                    render: (value) => {
                        const cls = {
                            'lookup_free':    'badge-info',
                            'lookup_premium': 'badge-secondary',
                            'cache_hit':      'badge-success',
                            'api_error':      'badge-danger'
                        }[value] || 'badge-secondary';
                        return `<span class="badge ${cls}">${_.escape(value)}</span>`;
                    }
                },
                { key: 'postcode', title: 'Postcode', sortable: true },
                {
                    key: 'tier',
                    title: 'Tier',
                    sortable: true,
                    render: (value) =>
                        `<span class="badge ${value === 'premium' ? 'badge-secondary' : 'badge-info'}">${_.escape(value)}</span>`
                },
                {
                    key: 'cacheHit',
                    title: 'Cache',
                    sortable: true,
                    render: (value) =>
                        value
                            ? '<span class="badge badge-success">Hit</span>'
                            : '<span class="badge badge-danger">Miss</span>'
                },
                {
                    key: 'createdAt',
                    title: 'Time',
                    sortable: true,
                    render: (value) => formatDate(value)
                }
            ],
            pagination: true,
            pageSize: 20,
            striped: true,
            search: true,
            exportPanel: true,
            exportOptions: ['csv', 'json']
        });
    } else {
        activityTable.setData(tableData);
    }
}

/**
 * Wire up the three-tab search tool (postcode lookup / browse / address search).
 */
function initSearchTabs() {
    const searchTabs = E.tabs('#search-tabs');

    // Partial postcode browse
    const searchBtn = (id, action) => {
        $(id).on('keydown', (e) => { if (e.key === 'Enter') action(); });
    };

    searchBtn('#browse-postcode-input', () => $('#browse-postcode-btn').trigger('click'));
    $('#browse-postcode-btn').on('click', async () => {
        const q       = $('#browse-postcode-input').val().trim();
        const $result = $('#browse-postcode-result');
        if (!q || q.length < 2) { E.toast('Enter at least 2 characters', { type: 'warning' }); return; }

        $result.show().html('<div class="text-muted py-3 text-center"><span data-icon="loader"></span> Searching…</div>');
        I.scan($result[0]);

        try {
            const res = await H.get(`${API_URL}/address/admin/search/postcodes?q=${encodeURIComponent(q)}`, { headers: AdminAuth.getAuthHeaders() });
            if (!res.success || !res.postcodes.length) {
                $result.html('<p class="text-muted">No postcodes found.</p>');
                return;
            }
            const rows = res.postcodes.map(p => `
                <tr>
                    <td><code style="cursor:pointer;" class="browse-pcd-link" data-postcode="${_.escape(p.postcode)}">${_.escape(p.postcode)}</code></td>
                    <td>${p.addressCount}</td>
                    <td>${(p.sources || []).join(', ')}</td>
                    <td>${p.lrRecordCount || 0} LR / ${p.chRecordCount || 0} CH</td>
                </tr>`).join('');
            $result.html(`
                <p class="text-muted mb-2" style="font-size:0.85rem;">${res.count} postcode${res.count !== 1 ? 's' : ''} found</p>
                <table class="table" style="font-size:0.875rem;">
                    <thead><tr><th>Postcode</th><th>Addresses</th><th>Sources</th><th>Records</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>`);

            // Click to full-lookup any postcode
            $result.on('click', '.browse-pcd-link', function() {
                const pcd = $(this).attr('data-postcode');
                searchTabs.show(0);
                $('#test-postcode-input').val(pcd);
                $('#test-lookup-btn').trigger('click');
            });
        } catch (err) {
            $result.html(`<div class="alert alert-danger">${_.escape(err.message || 'Search failed')}</div>`);
        }
    });

    // Address text search
    searchBtn('#addr-search-input', () => $('#addr-search-btn').trigger('click'));
    $('#addr-search-btn').on('click', async () => {
        const q       = $('#addr-search-input').val().trim();
        const pcd     = $('#addr-search-postcode').val().trim();
        const $result = $('#addr-search-result');
        if (!q || q.length < 2) { E.toast('Enter at least 2 characters', { type: 'warning' }); return; }

        $result.show().html('<div class="text-muted py-3 text-center"><span data-icon="loader"></span> Searching…</div>');
        I.scan($result[0]);

        try {
            const qs  = `q=${encodeURIComponent(q)}${pcd ? '&postcode=' + encodeURIComponent(pcd) : ''}`;
            const res = await H.get(`${API_URL}/address/admin/search/addresses?${qs}`, { headers: AdminAuth.getAuthHeaders() });
            if (!res.success || !res.addresses.length) {
                $result.html('<p class="text-muted">No matching addresses found.</p>');
                return;
            }
            const rows = res.addresses.map(({ postcode, address: a }) => `
                <tr>
                    <td><code style="cursor:pointer;" class="addr-pcd-link" data-postcode="${_.escape(postcode)}">${_.escape(postcode)}</code></td>
                    <td>${_.escape(a.formatted || a.line1)}</td>
                    <td>${(a.sources || []).map(s => `<span class="badge badge-secondary" style="font-size:0.7rem;">${_.escape(s)}</span>`).join(' ')}</td>
                    <td>${a.lastSalePrice ? '£' + a.lastSalePrice.toLocaleString() : '-'}</td>
                </tr>`).join('');
            $result.html(`
                <p class="text-muted mb-2" style="font-size:0.85rem;">${res.count} address${res.count !== 1 ? 'es' : ''} found</p>
                <table class="table" style="font-size:0.875rem;">
                    <thead><tr><th>Postcode</th><th>Address</th><th>Source</th><th>Last Sale</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>`);

            // Click to full-lookup
            $result.on('click', '.addr-pcd-link', function() {
                const p = $(this).attr('data-postcode');
                searchTabs.show(0);
                $('#test-postcode-input').val(p);
                $('#test-lookup-btn').trigger('click');
            });
        } catch (err) {
            $result.html(`<div class="alert alert-danger">${_.escape(err.message || 'Search failed')}</div>`);
        }
    });
}

/**
 * Wire up the test postcode lookup tool.
 */
function initTestLookup() {
    const PROPERTY_TYPES = { D: 'Detached', S: 'Semi-detached', T: 'Terraced', F: 'Flat', O: 'Other' };
    const TENURE_TYPES   = { F: 'Freehold', L: 'Leasehold' };

    $('#test-postcode-input').on('keydown', (e) => {
        if (e.key === 'Enter') $('#test-lookup-btn').trigger('click');
    });

    $('#test-lookup-btn').on('click', async () => {
        const postcode   = $('#test-postcode-input').val().trim().toUpperCase();
        const lookupType = $('#test-lookup-tier').val();

        if (!postcode) {
            E.toast('Enter a postcode', { type: 'warning' });
            return;
        }

        const $result = $('#test-lookup-result');
        $result.show().html('<div class="text-muted py-4 text-center"><span data-icon="loader"></span> Looking up…</div>');
        I.scan($result[0]);

        try {
            const response = await H.post(`${API_URL}/address/admin/test-lookup`, {
                postcode,
                lookupType
            }, { headers: AdminAuth.getAuthHeaders() });

            if (!response.success) {
                $result.html(`<div class="alert alert-danger"><strong>Not found:</strong> ${_.escape(response.error || 'No result')}</div>`);
                return;
            }

            const data      = response.data;
            const addresses = data.addresses || [];
            const pcd       = data.postcodeData || {};

            // Postcode summary
            let html = `
                <div class="mb-4" style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
                    <h3 style="margin:0;">${_.escape(data.postcode)}</h3>
                    <span class="badge badge-success">${addresses.length} address${addresses.length !== 1 ? 'es' : ''}</span>
                    ${response.cached ? '<span class="badge badge-info">cached</span>' : '<span class="badge badge-secondary">live</span>'}
                    ${response.creditCharged ? '<span class="badge badge-warning">1 credit charged</span>' : ''}
                </div>`;

            // ONS geographic data if present
            if (pcd.region || pcd.latitude) {
                html += `<div class="card mb-4" style="background: var(--color-ambient-subtle, #f8fafc);">
                    <div class="card-body" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:0.5rem 1rem; font-size:0.85rem;">
                        ${pcd.region    ? `<div><strong>Region</strong><br>${_.escape(pcd.region)}</div>` : ''}
                        ${pcd.latitude  ? `<div><strong>Lat / Lng</strong><br>${pcd.latitude}, ${pcd.longitude}</div>` : ''}
                        ${pcd.country   ? `<div><strong>Country</strong><br>${_.escape(pcd.country)}</div>` : ''}
                        ${pcd.ward      ? `<div><strong>Ward</strong><br>${_.escape(pcd.ward)}</div>` : ''}
                        ${pcd.district  ? `<div><strong>District</strong><br>${_.escape(pcd.district)}</div>` : ''}
                    </div>
                </div>`;
            }

            // Address list
            if (addresses.length === 0) {
                html += `<p class="text-muted">No street addresses returned (validate-only or uncovered postcode).</p>`;
            } else {
                html += `<div style="display:flex; flex-direction:column; gap:0.75rem;">`;
                for (const addr of addresses) {
                    const txs = addr.transactions || [];
                    const typeLabel   = PROPERTY_TYPES[addr.propertyType] || '';
                    const tenureLabel = TENURE_TYPES[addr.tenure] || '';

                    // Transaction history rows
                    let txHtml = '';
                    if (txs.length) {
                        const rows = txs.map(tx => `
                            <tr>
                                <td>${D(tx.date).format('DD MMM YYYY')}</td>
                                <td><strong>£${tx.price.toLocaleString()}</strong></td>
                                <td>${PROPERTY_TYPES[tx.propertyType] || '-'}</td>
                                <td>${TENURE_TYPES[tx.tenure] || '-'}</td>
                                <td>${tx.isNewBuild ? '<span class="badge badge-info">New build</span>' : ''}</td>
                            </tr>`).join('');
                        txHtml = `
                            <details style="margin-top:0.5rem;">
                                <summary style="cursor:pointer; font-size:0.8rem; color:var(--color-primary);">
                                    ${txs.length} transaction${txs.length !== 1 ? 's' : ''} since 1995
                                </summary>
                                <table class="table" style="margin-top:0.5rem; font-size:0.8rem;">
                                    <thead><tr><th>Date</th><th>Price</th><th>Type</th><th>Tenure</th><th></th></tr></thead>
                                    <tbody>${rows}</tbody>
                                </table>
                            </details>`;
                    }

                    html += `
                        <div class="card" style="border-left: 3px solid var(--color-primary);">
                            <div class="card-body" style="padding:0.75rem 1rem;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">
                                    <div>
                                        <strong>${_.escape(addr.formatted || addr.line1)}</strong>
                                        <div style="font-size:0.8rem; color:var(--color-text-muted); margin-top:0.2rem;">
                                            ${addr.sources.map(s => `<span class="badge badge-secondary" style="font-size:0.7rem;">${_.escape(s)}</span>`).join(' ')}
                                        </div>
                                    </div>
                                    <div style="text-align:right; font-size:0.85rem;">
                                        ${typeLabel   ? `<span class="badge badge-info">${_.escape(typeLabel)}</span> ` : ''}
                                        ${tenureLabel ? `<span class="badge badge-secondary">${_.escape(tenureLabel)}</span>` : ''}
                                        ${addr.lastSalePrice ? `<div style="margin-top:0.25rem;"><strong>Last: £${addr.lastSalePrice.toLocaleString()}</strong> <span class="text-muted">${D(addr.lastSaleDate).format('MMM YYYY')}</span></div>` : ''}
                                    </div>
                                </div>
                                ${txHtml}
                            </div>
                        </div>`;
                }
                html += `</div>`;
            }

            $result.html(html);
            I.scan($result[0]);

        } catch (err) {
            $result.html(`<div class="alert alert-danger"><strong>Error:</strong> ${_.escape(err.message || 'Lookup failed')}</div>`);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
