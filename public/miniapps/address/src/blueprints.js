/**
 * Domma Blueprints for Address Lookup Forms
 */

export const lookupBlueprint = {
  title: 'Lookup',
  fields: [
    {
      name: 'postcode',
      type: 'string',
      label: 'Postcode',
      required: true,
      placeholder: 'SW1A 1AA',
      minLength: 5,
      maxLength: 10,
      transform: (value) => value.toUpperCase()
    },
    {
      name: 'tier',
      type: 'select',
      label: 'Tier',
      required: true,
      defaultValue: 'free',
      options: [
        { value: 'free', label: 'Free Tier (Postcode data)' },
        { value: 'premium', label: 'Premium Tier (Full addresses - 1 credit)' }
      ]
    }
  ]
};

export const feedbackBlueprint = {
  title: 'Feedback',
  fields: [
    {
      name: 'subject',
      type: 'select',
      label: 'Subject',
      required: true,
      options: [
        { value: '', label: 'Select a subject...', disabled: true },
        { value: 'bug', label: 'Bug Report' },
        { value: 'feature', label: 'Feature Request' },
        { value: 'general', label: 'General Feedback' }
      ]
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
      minLength: 10,
      placeholder: 'Tell us what you think...',
      rows: 6
    }
  ]
};

export const apiKeyBlueprint = {
  title: 'Create API Key',
  fields: [
    {
      name: 'name',
      type: 'string',
      label: 'API Key Name',
      required: true,
      minLength: 3,
      maxLength: 50,
      placeholder: 'e.g., Production Server'
    },
    {
      name: 'freeLookup',
      type: 'boolean',
      label: 'Allow Free Lookups',
      defaultValue: true
    },
    {
      name: 'premiumLookup',
      type: 'boolean',
      label: 'Allow Premium Lookups',
      defaultValue: true
    },
    {
      name: 'requestsPerMinute',
      type: 'number',
      label: 'Requests per Minute',
      required: true,
      min: 1,
      max: 100,
      defaultValue: 60
    },
    {
      name: 'requestsPerDay',
      type: 'number',
      label: 'Requests per Day',
      required: true,
      min: 1,
      max: 10000,
      defaultValue: 1000
    }
  ]
};

export const saveAddressBlueprint = {
  title: 'Save Address',
  fields: [
    {
      name: 'name',
      type: 'string',
      label: 'Address Name',
      required: true,
      placeholder: 'e.g., Home, Office, Mum\'s House',
      minLength: 1,
      maxLength: 100
    },
    {
      name: 'saveMode',
      type: 'radio',
      label: 'Save Mode',
      required: true,
      options: [
        { value: 'normal', label: 'Normal', hint: '24h cache - 1 credit per lookup' },
        { value: 'saved', label: 'Delayed', hint: '7 day cache, auto-refreshes (1 credit per refresh)' },
        { value: 'permanent', label: 'Permanent', hint: 'Pay once (1 credit), free forever' }
      ],
      defaultValue: 'normal'
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes (optional)',
      placeholder: 'Any additional notes...',
      rows: 3,
      maxLength: 1000
    },
    {
      name: 'tags',
      type: 'string',
      label: 'Tags (comma-separated)',
      placeholder: 'home, family, delivery',
      maxLength: 200
    }
  ]
};

export const contactBlueprint = {
  title: 'Contact Us',
  fields: [
    {
      name: 'name',
      type: 'string',
      label: 'Name',
      required: true,
      minLength: 2,
      maxLength: 100
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true
    },
    {
      name: 'projectType',
      type: 'select',
      label: 'Enquiry Type',
      required: true,
      options: [
        { value: 'support', label: 'Technical Support' },
        { value: 'inquiry', label: 'General Enquiry' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'details',
      type: 'textarea',
      label: 'Message',
      required: true,
      minLength: 10,
      rows: 5,
      placeholder: 'How can we help?'
    }
  ]
};
