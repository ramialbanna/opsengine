import {
  Workflow,
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
      { id: 'stages', label: 'The twelve stages', path: '/stages', icon: Workflow, description: 'The full lifecycle, sourcing through post-sale.' },
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