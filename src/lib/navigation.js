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
  FileStack,
  Server,
  ShieldCheck,
  MapPin,
  Users,
  Layers,
  BookMarked,
  ClipboardList,
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
      { id: 'roles', label: 'Roles', path: '/roles', icon: Users, description: 'Who decides what, and who they go to.' },
      { id: 'onboarding', label: 'New Hire Onboarding', path: '/onboarding', icon: BookOpen, description: 'Role learning paths and ramp guides.' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { id: 'deal-scenarios', label: 'Deal scenarios', path: '/deal-scenarios', icon: Layers, description: 'Find the right documents for any deal.' },
      { id: 'documents', label: 'Document Library', path: '/documents', icon: FileStack, description: 'Every document, when it is collected, and the rules.' },
      { id: 'systems', label: 'Systems', path: '/systems', icon: Server, description: 'Every system we use and who uses it.' },
      { id: 'controls', label: 'Controls', path: '/controls', icon: ShieldCheck, description: 'Checks that run in the business, by frequency.' },
      { id: 'locations', label: 'Locations', path: '/locations', icon: MapPin, description: 'Our sites, including retired names.' },
      { id: 'glossary', label: 'Glossary', path: '/glossary', icon: BookMarked, description: 'Definitions and acronyms used across the operation.' },
      { id: 'open-items', label: 'Open items', path: '/open-items', icon: ClipboardList, description: 'Procedures still being written or reviewed.' },
    ],
  },
];

export const allSections = navGroups.flatMap((group) => group.items);