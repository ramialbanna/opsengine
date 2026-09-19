import {
  PackageSearch,
  Truck,
  PackageCheck,
  Wrench,
  Boxes,
  Gavel,
  Handshake,
  Wallet,
  Building2,
  BookOpen,
} from 'lucide-react';

export const navGroups = [
  {
    label: 'Operations',
    items: [
      { id: 'sourcing', label: 'Sourcing', path: '/sourcing', icon: PackageSearch, description: 'Finding, valuing, and buying vehicles.' },
      { id: 'transport', label: 'Transport', path: '/transport', icon: Truck, description: 'Pickup, dispatcher workflow, and field logistics.' },
      { id: 'receiving', label: 'Receiving', path: '/receiving', icon: PackageCheck, description: 'Lot intake, check-in, and condition log.' },
      { id: 'reconditioning', label: 'Reconditioning', path: '/reconditioning', icon: Wrench, description: 'Mechanical, body, detail, and photo.' },
      { id: 'inventory', label: 'Inventory', path: '/inventory', icon: Boxes, description: 'Stocking, pricing, and merchandising.' },
      { id: 'auction', label: 'Auction', path: '/auction', icon: Gavel, description: 'Listing, run lists, and sale day.' },
      { id: 'sales', label: 'Sales', path: '/sales', icon: Handshake, description: 'Deal desk, buyer relations, and paperwork.' },
      { id: 'collections', label: 'Collections', path: '/collections', icon: Wallet, description: 'Invoicing, funding, and accounts receivable.' },
    ],
  },
  {
    label: 'People',
    items: [
      { id: 'departments', label: 'Departments & Roles', path: '/departments', icon: Building2, description: 'Teams, responsibilities, and escalation.' },
      { id: 'onboarding', label: 'New Hire Onboarding', path: '/onboarding', icon: BookOpen, description: 'Role learning paths and ramp guides.' },
    ],
  },
];

export const allSections = navGroups.flatMap((group) => group.items);