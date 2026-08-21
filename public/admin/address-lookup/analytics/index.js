/**
 * Address Lookup Admin - Analytics
 */

import AdminAuth from '../../shared/admin-auth.js';
import { getApiUrl, formatDate, initALSidebar } from '../shared/al-sidebar.js';

const API_URL = getApiUrl();

/** Chart.js instances keyed by name. */
const charts = {};

/** T.create() table instances. */
let postcodesTable = null;
let errorsTable    = null;

/** Currently selected time period in days. */
let currentPeriod = 30;

/**
 * Initialise the page.
 */
async function init() {
    if (!AdminAuth.init(API_URL, ['admin'])) {
        return;
    }

    initALSidebar('analytics');
    setupEventListeners();
    await loadAnalytics();

    $('body').removeClass('dm-cloaked');
}

function setupEventListeners() {
    $('#time-period').on('change', async (e) => {
        currentPeriod = parseInt($(e.target).val());
        await loadAnalytics();
    });
}

// ─── Data ────────────────────────────────────────────────────────────────────

async function loadAnalytics() {
    try {
        const response = await Domma.http.get(
            `${API_URL}/address/admin/address-lookup/analytics?days=${currentPeriod}`,
            { headers: AdminAuth.getAuthHeaders() }
        );

        if (response.success && response.analytics) {
            renderCharts(response.analytics);
            renderPostcodesTable(response.analytics.popularPostcodes);
            renderErrorsTable(response.analytics.recentErrors);
        } else {
            throw new Error(response.message || 'Failed to load analytics');
        }
    } catch (error) {
        console.error('[AddressLookupAnalytics] Failed to load analytics:', error);
        Domma.elements.toast('Failed to load analytics', { type: 'error' });
    }
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function renderCharts(analytics) {
    renderLookupsChart(analytics.lookupsOverTime);
    renderTierChart(analytics.tierBreakdown);
    renderCacheChart(analytics.cachePerformance);
    renderProviderChart(analytics.providerUsage);
}

function renderLookupsChart(data) {
    const ctx = document.getElementById('lookups-chart');
    if (charts.lookups) charts.lookups.destroy();

    charts.lookups = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                { label: 'Free Lookups',    data: data.free,    borderColor: '#007bff', backgroundColor: 'rgba(0,123,255,0.1)',   tension: 0.4 },
                { label: 'Premium Lookups', data: data.premium, borderColor: '#6c757d', backgroundColor: 'rgba(108,117,125,0.1)', tension: 0.4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderTierChart(data) {
    const ctx = document.getElementById('tier-chart');
    if (charts.tier) charts.tier.destroy();

    charts.tier = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Free', 'Premium'],
            datasets: [{ data: [data.free, data.premium], backgroundColor: ['#007bff', '#6c757d'] }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function renderCacheChart(data) {
    const ctx = document.getElementById('cache-chart');
    if (charts.cache) charts.cache.destroy();

    charts.cache = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Cache Hits', 'Cache Misses'],
            datasets: [{ label: 'Count', data: [data.hits, data.misses], backgroundColor: ['#28a745', '#dc3545'] }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderProviderChart(data) {
    const ctx = document.getElementById('provider-chart');
    if (charts.provider) charts.provider.destroy();

    const colours = ['#007bff', '#6c757d', '#28a745', '#ffc107', '#dc3545'];

    charts.provider = new Chart(ctx, {
        type: 'pie',
        data: {
            labels:   data.map(p => p.provider),
            datasets: [{ data: data.map(p => p.count), backgroundColor: colours.slice(0, data.length) }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// ─── Tables ───────────────────────────────────────────────────────────────────

function renderPostcodesTable(postcodes) {
    const tableData = (postcodes || []).map((pc, index) => ({
        rank:         index + 1,
        postcode:     pc.postcode,
        count:        pc.count,
        free:         pc.free,
        premium:      pc.premium,
        cacheHitRate: pc.cacheHitRate
    }));

    if (!postcodesTable) {
        postcodesTable = T.create('#popular-postcodes-table', {
            data: tableData,
            columns: [
                { key: 'rank',     title: 'Rank',     sortable: false },
                { key: 'postcode', title: 'Postcode', sortable: true },
                { key: 'count',    title: 'Lookups',  sortable: true, render: (v) => v.toLocaleString() },
                { key: 'free',     title: 'Free',     sortable: true, render: (v) => v.toLocaleString() },
                { key: 'premium',  title: 'Premium',  sortable: true, render: (v) => v.toLocaleString() },
                {
                    key: 'cacheHitRate',
                    title: 'Cache Hit Rate',
                    sortable: true,
                    render: (value) => {
                        const cls = value > 50 ? 'badge-success' : 'badge-secondary';
                        return `<span class="badge ${cls}">${value.toFixed(1)}%</span>`;
                    }
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
        postcodesTable.setData(tableData);
    }
}

function renderErrorsTable(errors) {
    const tableData = (errors || []).map(e => ({
        createdAt: e.createdAt,
        userEmail: e.userEmail,
        postcode:  e.postcode || '-',
        provider:  e.provider || '-',
        error:     e.error
    }));

    if (!errorsTable) {
        errorsTable = T.create('#errors-table', {
            data: tableData,
            columns: [
                {
                    key: 'createdAt',
                    title: 'Date',
                    sortable: true,
                    render: (value) => formatDate(value)
                },
                { key: 'userEmail', title: 'User',     sortable: true },
                { key: 'postcode',  title: 'Postcode', sortable: true },
                { key: 'provider',  title: 'Provider', sortable: true },
                {
                    key: 'error',
                    title: 'Error',
                    sortable: false,
                    render: (value) => `<span class="text-danger">${_.escape(value)}</span>`
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
        errorsTable.setData(tableData);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
