/**
 * Product Blueprint
 *
 * E-commerce product management with pricing, inventory, and categories.
 * Optimized for CRUD operations and product catalogs.
 *
 * Usage:
 *   import { productBlueprint } from './blueprints/crud/product.js';
 *
 *   // Complete CRUD setup
 *   F.crud('#products', productBlueprint, {
 *       title: 'Product Catalog',
 *       apiEndpoint: '/api/products',
 *       columns: ['name', 'sku', 'price', 'category', 'stock', 'active']
 *   });
 *
 *   // Or use as regular form
 *   F.modal(productBlueprint, {
 *       title: 'Add Product',
 *       onSave: saveProduct
 *   });
 */

export const productBlueprint = {
    // Basic Information
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 200,
        label: 'Product Name',
        formConfig: {
            placeholder: 'Enter product name',
            tooltip: 'The display name for this product'
        }
    },
    sku: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[A-Z0-9-]+$/,
        label: 'SKU',
        formConfig: {
            placeholder: 'PROD-001',
            tooltip: 'Stock Keeping Unit (uppercase letters, numbers, hyphens)',
            class: 'text-uppercase'
        }
    },
    description: {
        type: 'textarea',
        maxLength: 2000,
        rows: 4,
        label: 'Description',
        formConfig: {
            placeholder: 'Detailed product description...',
            tooltip: 'Full product description (supports markdown)'
        }
    },
    shortDescription: {
        type: 'string',
        maxLength: 200,
        label: 'Short Description',
        formConfig: {
            placeholder: 'Brief product summary',
            tooltip: 'Used in product listings and previews'
        }
    },

    // Pricing
    price: {
        type: 'number',
        required: true,
        min: 0,
        label: 'Price',
        formConfig: {
            placeholder: '0.00',
            tooltip: 'Regular price in USD',
            prefix: '$'
        }
    },
    salePrice: {
        type: 'number',
        min: 0,
        custom: (value, allData) => {
            if (value && allData.price && value >= allData.price) {
                return 'Sale price must be less than regular price';
            }
        },
        label: 'Sale Price',
        formConfig: {
            placeholder: '0.00',
            tooltip: 'Optional: Discounted price',
            prefix: '$'
        }
    },
    cost: {
        type: 'number',
        min: 0,
        label: 'Cost',
        formConfig: {
            placeholder: '0.00',
            tooltip: 'Your cost (for margin calculations)',
            prefix: '$'
        }
    },

    // Category & Classification
    category: {
        type: 'select',
        required: true,
        options: [
            { value: '', label: 'Select Category' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'books', label: 'Books' },
            { value: 'home', label: 'Home & Garden' },
            { value: 'sports', label: 'Sports & Outdoors' },
            { value: 'toys', label: 'Toys & Games' },
            { value: 'other', label: 'Other' }
        ],
        label: 'Category',
        formConfig: {
            tooltip: 'Product category for organization'
        }
    },
    brand: {
        type: 'string',
        maxLength: 100,
        label: 'Brand',
        formConfig: {
            placeholder: 'Brand name',
            tooltip: 'Manufacturer or brand name'
        }
    },
    tags: {
        type: 'string',
        label: 'Tags',
        formConfig: {
            placeholder: 'tag1, tag2, tag3',
            tooltip: 'Comma-separated tags for search and filtering'
        }
    },

    // Inventory
    stock: {
        type: 'number',
        required: true,
        min: 0,
        label: 'Stock Quantity',
        formConfig: {
            placeholder: '0',
            tooltip: 'Available inventory count'
        }
    },
    lowStockThreshold: {
        type: 'number',
        min: 0,
        label: 'Low Stock Alert',
        formConfig: {
            placeholder: '10',
            tooltip: 'Alert when stock falls below this number'
        }
    },
    trackInventory: {
        type: 'boolean',
        label: 'Track Inventory',
        formConfig: {
            tooltip: 'Enable inventory tracking for this product'
        }
    },

    // Shipping
    weight: {
        type: 'number',
        min: 0,
        label: 'Weight (lbs)',
        formConfig: {
            placeholder: '0.0',
            tooltip: 'Product weight for shipping calculations'
        }
    },
    dimensions: {
        type: 'string',
        pattern: /^\d+\s*x\s*\d+\s*x\s*\d+$/,
        label: 'Dimensions (L x W x H)',
        formConfig: {
            placeholder: '10 x 5 x 3',
            tooltip: 'Product dimensions in inches (length x width x height)'
        }
    },

    // Images & Media
    imageUrl: {
        type: 'url',
        label: 'Product Image URL',
        formConfig: {
            placeholder: 'https://example.com/product.jpg',
            tooltip: 'Main product image'
        }
    },
    galleryUrls: {
        type: 'textarea',
        rows: 3,
        label: 'Gallery Images',
        formConfig: {
            placeholder: 'One URL per line',
            tooltip: 'Additional product images (one URL per line)'
        }
    },

    // Status & Visibility
    active: {
        type: 'boolean',
        label: 'Active',
        formConfig: {
            tooltip: 'Show product in store'
        }
    },
    featured: {
        type: 'boolean',
        label: 'Featured Product',
        formConfig: {
            tooltip: 'Highlight on homepage and in promotions'
        }
    },
    visibility: {
        type: 'select',
        options: [
            { value: 'public', label: 'Public' },
            { value: 'members', label: 'Members Only' },
            { value: 'hidden', label: 'Hidden' }
        ],
        label: 'Visibility',
        formConfig: {
            tooltip: 'Who can see this product'
        }
    }
};

/**
 * Simplified product blueprint for quick entry
 */
export const simpleProductBlueprint = {
    name: productBlueprint.name,
    sku: productBlueprint.sku,
    price: productBlueprint.price,
    category: productBlueprint.category,
    stock: productBlueprint.stock,
    active: productBlueprint.active
};

/**
 * Product listing fields (for tables/grids)
 */
export const productListingBlueprint = {
    name: productBlueprint.name,
    sku: productBlueprint.sku,
    price: productBlueprint.price,
    category: productBlueprint.category,
    stock: productBlueprint.stock,
    active: productBlueprint.active
};

/**
 * Digital product blueprint (no shipping)
 */
export const digitalProductBlueprint = {
    ...B.omit(productBlueprint, ['weight', 'dimensions', 'trackInventory']),
    downloadUrl: {
        type: 'url',
        required: true,
        label: 'Download URL',
        formConfig: {
            placeholder: 'https://example.com/download/file.zip',
            tooltip: 'Secure download link for digital product'
        }
    },
    fileSize: {
        type: 'string',
        label: 'File Size',
        formConfig: {
            placeholder: '25 MB',
            tooltip: 'Size of downloadable file'
        }
    },
    licenseType: {
        type: 'select',
        options: [
            { value: 'single', label: 'Single Use' },
            { value: 'multiple', label: 'Multiple Use' },
            { value: 'unlimited', label: 'Unlimited' }
        ],
        label: 'License Type',
        formConfig: {
            tooltip: 'Usage restrictions for digital product'
        }
    }
};

/**
 * Example CRUD setup function
 */
export function createProductCRUD(selector, options = {}) {
    const defaultOptions = {
        title: 'Product Catalog',
        apiEndpoint: '/api/products',
        columns: ['name', 'sku', 'price', 'category', 'stock', 'active'],
        pageSize: 20,
        sortable: true,
        exportable: true,
        onBeforeSave: (data) => {
            // Transform price values
            data.price = parseFloat(data.price);
            if (data.salePrice) {
                data.salePrice = parseFloat(data.salePrice);
            }
            if (data.cost) {
                data.cost = parseFloat(data.cost);
            }

            // Parse tags
            if (data.tags && typeof data.tags === 'string') {
                data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
            }

            // Parse gallery URLs
            if (data.galleryUrls && typeof data.galleryUrls === 'string') {
                data.galleryUrls = data.galleryUrls.split('\n').map(u => u.trim()).filter(Boolean);
            }

            return data;
        },
        onAfterSave: (data) => {
            E.toast(`Product "${data.name}" saved successfully!`, { type: 'success' });
        },
        onAfterDelete: (id) => {
            E.toast('Product deleted', { type: 'success' });
        }
    };

    return F.crud(selector, productBlueprint, {
        ...defaultOptions,
        ...options
    });
}
