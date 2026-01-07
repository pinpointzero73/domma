/**
 * Nexus Contact Manager - Forma Schema Definitions
 * Defines form schemas for contact and group management
 */

// Contact Form Schema
export const contactSchema = {
  title: 'Contact Information',
  description: 'Add or edit contact details',
  icon: 'user',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
        pattern: '^[a-zA-Z\\s]+$'
      },
      placeholder: 'Enter first name',
      grid: 'col-md-6'
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
        pattern: '^[a-zA-Z\\s]+$'
      },
      placeholder: 'Enter last name',
      grid: 'col-md-6'
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      validation: {
        email: true
      },
      placeholder: 'contact@example.com',
      grid: 'col-md-8'
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: false,
      validation: {
        pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,20}$'
      },
      placeholder: '+44 20 1234 5678',
      grid: 'col-md-4'
    },
    {
      name: 'company',
      label: 'Company',
      type: 'text',
      required: false,
      validation: {
        maxLength: 100
      },
      placeholder: 'Company name',
      grid: 'col-md-6'
    },
    {
      name: 'jobTitle',
      label: 'Job Title',
      type: 'text',
      required: false,
      validation: {
        maxLength: 100
      },
      placeholder: 'Position/role',
      grid: 'col-md-6'
    },
    {
      name: 'website',
      label: 'Website',
      type: 'url',
      required: false,
      validation: {
        url: true
      },
      placeholder: 'https://example.com',
      grid: 'col-md-6'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn Profile',
      type: 'url',
      required: false,
      validation: {
        url: true,
        pattern: '^https://(?:www\\.)?linkedin\\.com/in/'
      },
      placeholder: 'https://linkedin.com/in/username',
      grid: 'col-md-6'
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      required: false,
      validation: {
        maxLength: 500
      },
      placeholder: 'Street address, city, postcode',
      rows: 3,
      grid: 'col-12'
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      required: false,
      validation: {
        maxLength: 1000
      },
      placeholder: 'Additional notes or comments',
      rows: 4,
      grid: 'col-12'
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'tags',
      required: false,
      placeholder: 'Type tags and press Enter',
      help: 'Add tags to categorise this contact',
      grid: 'col-md-6'
    },
    {
      name: 'groups',
      label: 'Groups',
      type: 'multiselect',
      required: false,
      options: [], // Will be populated dynamically
      placeholder: 'Select groups',
      grid: 'col-md-6'
    },
    {
      name: 'favourite',
      label: 'Mark as Favourite',
      type: 'checkbox',
      required: false,
      grid: 'col-12'
    }
  ],
  actions: [
    {
      label: 'Save Contact',
      type: 'submit',
      variant: 'primary',
      icon: 'check'
    },
    {
      label: 'Cancel',
      type: 'button',
      variant: 'secondary',
      action: 'close'
    }
  ],
  layout: {
    type: 'grid',
    columns: 12,
    spacing: 'normal'
  }
};

// Group Form Schema
export const groupSchema = {
  title: 'Contact Group',
  description: 'Create or edit a contact group',
  icon: 'users',
  fields: [
    {
      name: 'name',
      label: 'Group Name',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      },
      placeholder: 'Enter group name',
      grid: 'col-md-8'
    },
    {
      name: 'colour',
      label: 'Colour',
      type: 'color',
      required: false,
      defaultValue: '#3b82f6',
      grid: 'col-md-4'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      validation: {
        maxLength: 500
      },
      placeholder: 'Optional description for this group',
      rows: 3,
      grid: 'col-12'
    },
    {
      name: 'type',
      label: 'Group Type',
      type: 'select',
      required: true,
      options: [
        {value: 'personal', label: 'Personal'},
        {value: 'work', label: 'Work'},
        {value: 'client', label: 'Client'},
        {value: 'supplier', label: 'Supplier'},
        {value: 'family', label: 'Family'},
        {value: 'friend', label: 'Friends'},
        {value: 'other', label: 'Other'}
      ],
      defaultValue: 'personal',
      grid: 'col-md-6'
    },
    {
      name: 'privacy',
      label: 'Privacy Level',
      type: 'select',
      required: true,
      options: [
        {value: 'private', label: 'Private'},
        {value: 'shared', label: 'Shared'},
        {value: 'public', label: 'Public'}
      ],
      defaultValue: 'private',
      grid: 'col-md-6'
    }
  ],
  actions: [
    {
      label: 'Save Group',
      type: 'submit',
      variant: 'primary',
      icon: 'check'
    },
    {
      label: 'Cancel',
      type: 'button',
      variant: 'secondary',
      action: 'close'
    }
  ],
  layout: {
    type: 'grid',
    columns: 12,
    spacing: 'normal'
  }
};

// Contact Search/Filter Schema
export const contactFilterSchema = {
  title: 'Filter Contacts',
  description: 'Search and filter your contacts',
  icon: 'search',
  fields: [
    {
      name: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by name, email, or company',
      grid: 'col-md-6'
    },
    {
      name: 'group',
      label: 'Group',
      type: 'select',
      options: [
        {value: '', label: 'All Groups'}
        // Will be populated dynamically
      ],
      grid: 'col-md-3'
    },
    {
      name: 'favourites',
      label: 'Favourites Only',
      type: 'checkbox',
      grid: 'col-md-3'
    }
  ],
  actions: [
    {
      label: 'Apply Filter',
      type: 'submit',
      variant: 'primary',
      icon: 'filter'
    },
    {
      label: 'Clear',
      type: 'button',
      variant: 'secondary',
      action: 'reset'
    }
  ],
  layout: {
    type: 'inline',
    spacing: 'compact'
  }
};

// Import Contacts Schema
export const importSchema = {
  title: 'Import Contacts',
  description: 'Import contacts from CSV or vCard files',
  icon: 'upload',
  fields: [
    {
      name: 'file',
      label: 'Select File',
      type: 'file',
      required: true,
      accept: '.csv,.vcf,.vcard',
      validation: {
        maxSize: '5MB',
        allowedTypes: ['text/csv', 'text/vcard', 'text/x-vcard']
      },
      grid: 'col-12'
    },
    {
      name: 'format',
      label: 'File Format',
      type: 'radio',
      required: true,
      options: [
        {value: 'csv', label: 'CSV (Comma Separated Values)'},
        {value: 'vcard', label: 'vCard (.vcf)'}
      ],
      defaultValue: 'csv',
      grid: 'col-12'
    },
    {
      name: 'group',
      label: 'Assign to Group',
      type: 'select',
      required: false,
      options: [
        {value: '', label: 'No group assignment'}
        // Will be populated dynamically
      ],
      help: 'Optionally assign all imported contacts to a group',
      grid: 'col-md-6'
    },
    {
      name: 'duplicateHandling',
      label: 'Handle Duplicates',
      type: 'select',
      required: true,
      options: [
        {value: 'skip', label: 'Skip duplicates'},
        {value: 'update', label: 'Update existing contacts'},
        {value: 'create', label: 'Create duplicate entries'}
      ],
      defaultValue: 'skip',
      grid: 'col-md-6'
    }
  ],
  actions: [
    {
      label: 'Import Contacts',
      type: 'submit',
      variant: 'primary',
      icon: 'upload'
    },
    {
      label: 'Cancel',
      type: 'button',
      variant: 'secondary',
      action: 'close'
    }
  ],
  layout: {
    type: 'grid',
    columns: 12,
    spacing: 'normal'
  }
};

// Export schema configurations for different form types
export const schemas = {
  contact: contactSchema,
  group: groupSchema,
  filter: contactFilterSchema,
  import: importSchema
};