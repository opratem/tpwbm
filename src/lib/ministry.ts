// Ministry Role Management Utilities

export type MinistryRole =
  | 'pastor'
  | 'associate_pastor'
  | 'elder'
  | 'deacon'
  | 'deaconess'
  | 'worship_leader'
  | 'youth_pastor'
  | 'children_minister'
  | 'music_director'
  | 'choir_director'
  | 'usher_coordinator'
  | 'womens_ministry_leader'
  | 'mens_ministry_leader'
  | 'sunday_school_superintendent'
  | 'secretary'
  | 'treasurer'
  | 'trustee'
  | 'evangelist'
  | 'missionary'
  | 'small_group_leader'
  | 'media_coordinator'
  | 'outreach_coordinator';

export type MinistryLevel =
  | 'senior_leadership'
  | 'board_member'
  | 'ministry_leader'
  | 'ministry_member'
  | 'volunteer';

export interface MinistryRoleInfo {
  value: MinistryRole;
  label: string;
  level: MinistryLevel;
  description: string;
  permissions: string[];
}

export const MINISTRY_ROLES: Record<MinistryRole, MinistryRoleInfo> = {
  pastor: {
    value: 'pastor',
    label: 'Pastor',
    level: 'senior_leadership',
    description: 'Senior Pastor and spiritual leader of the church',
    permissions: ['all']
  },
  associate_pastor: {
    value: 'associate_pastor',
    label: 'Associate Pastor',
    level: 'senior_leadership',
    description: 'Assistant to the Senior Pastor',
    permissions: ['manage_members', 'manage_events', 'manage_ministries', 'view_reports']
  },
  elder: {
    value: 'elder',
    label: 'Elder',
    level: 'board_member',
    description: 'Church board member and spiritual advisor',
    permissions: ['manage_members', 'manage_events', 'view_reports']
  },
  deacon: {
    value: 'deacon',
    label: 'Deacon',
    level: 'board_member',
    description: 'Serves the church and assists with pastoral care',
    permissions: ['manage_events', 'manage_prayer_requests']
  },
  deaconess: {
    value: 'deaconess',
    label: 'Deaconess',
    level: 'board_member',
    description: 'Serves the church with focus on women\'s ministry',
    permissions: ['manage_events', 'manage_prayer_requests']
  },
  worship_leader: {
    value: 'worship_leader',
    label: 'Worship Leader',
    level: 'ministry_leader',
    description: 'Leads worship services and coordinates music ministry',
    permissions: ['manage_worship', 'manage_media']
  },
  youth_pastor: {
    value: 'youth_pastor',
    label: 'Youth Pastor',
    level: 'ministry_leader',
    description: 'Ministers to youth and coordinates youth programs',
    permissions: ['manage_youth_ministry', 'manage_events']
  },
  children_minister: {
    value: 'children_minister',
    label: 'Children\'s Minister',
    level: 'ministry_leader',
    description: 'Ministers to children and coordinates children\'s programs',
    permissions: ['manage_children_ministry', 'manage_events']
  },
  music_director: {
    value: 'music_director',
    label: 'Music Director',
    level: 'ministry_leader',
    description: 'Directs church music programs and choir',
    permissions: ['manage_music', 'manage_media']
  },
  choir_director: {
    value: 'choir_director',
    label: 'Choir Director',
    level: 'ministry_member',
    description: 'Leads church choir and special music',
    permissions: ['manage_choir']
  },
  usher_coordinator: {
    value: 'usher_coordinator',
    label: 'Usher Coordinator',
    level: 'ministry_leader',
    description: 'Coordinates ushering team and Sunday services',
    permissions: ['manage_ushers', 'manage_events']
  },
  womens_ministry_leader: {
    value: 'womens_ministry_leader',
    label: 'Women\'s Ministry Leader',
    level: 'ministry_leader',
    description: 'Leads women\'s ministry programs and events',
    permissions: ['manage_womens_ministry', 'manage_events']
  },
  mens_ministry_leader: {
    value: 'mens_ministry_leader',
    label: 'Men\'s Ministry Leader',
    level: 'ministry_leader',
    description: 'Leads men\'s ministry programs and events',
    permissions: ['manage_mens_ministry', 'manage_events']
  },
  sunday_school_superintendent: {
    value: 'sunday_school_superintendent',
    label: 'Sunday School Superintendent',
    level: 'ministry_leader',
    description: 'Oversees Sunday school programs and teachers',
    permissions: ['manage_sunday_school', 'manage_education']
  },
  secretary: {
    value: 'secretary',
    label: 'Church Secretary',
    level: 'ministry_member',
    description: 'Handles church correspondence and administrative tasks',
    permissions: ['manage_announcements', 'view_reports']
  },
  treasurer: {
    value: 'treasurer',
    label: 'Church Treasurer',
    level: 'board_member',
    description: 'Manages church finances and financial reporting',
    permissions: ['manage_finances', 'view_reports']
  },
  trustee: {
    value: 'trustee',
    label: 'Trustee',
    level: 'board_member',
    description: 'Oversees church property and legal matters',
    permissions: ['manage_property', 'view_reports']
  },
  evangelist: {
    value: 'evangelist',
    label: 'Evangelist',
    level: 'ministry_member',
    description: 'Focuses on evangelism and outreach ministry',
    permissions: ['manage_outreach']
  },
  missionary: {
    value: 'missionary',
    label: 'Missionary',
    level: 'ministry_member',
    description: 'Serves in missions work and global outreach',
    permissions: ['manage_missions']
  },
  small_group_leader: {
    value: 'small_group_leader',
    label: 'Small Group Leader',
    level: 'ministry_member',
    description: 'Leads small group Bible studies and fellowship',
    permissions: ['manage_small_groups']
  },
  media_coordinator: {
    value: 'media_coordinator',
    label: 'Media Coordinator',
    level: 'ministry_member',
    description: 'Manages church media and technical equipment',
    permissions: ['manage_media', 'manage_announcements']
  },
  outreach_coordinator: {
    value: 'outreach_coordinator',
    label: 'Outreach Coordinator',
    level: 'ministry_leader',
    description: 'Coordinates community outreach and service projects',
    permissions: ['manage_outreach', 'manage_events']
  }
};

export const MINISTRY_LEVELS = {
  senior_leadership: {
    label: 'Senior Leadership',
    description: 'Pastoral staff and senior leadership',
    priority: 1
  },
  board_member: {
    label: 'Board Member',
    description: 'Church board and governing body members',
    priority: 2
  },
  ministry_leader: {
    label: 'Ministry Leader',
    description: 'Department heads and ministry coordinators',
    priority: 3
  },
  ministry_member: {
    label: 'Ministry Member',
    description: 'Active ministry participants',
    priority: 4
  },
  volunteer: {
    label: 'Volunteer',
    description: 'General volunteers and helpers',
    priority: 5
  }
};

// Utility functions
export function getMinistryRoleInfo(role: MinistryRole): MinistryRoleInfo {
  return MINISTRY_ROLES[role];
}

export function getMinistryRolesByLevel(level: MinistryLevel): MinistryRole[] {
  return Object.values(MINISTRY_ROLES)
    .filter(role => role.level === level)
    .map(role => role.value);
}

export function hasMinistryPermission(
  userMinistryRole: MinistryRole | null | undefined,
  requiredPermission: string
): boolean {
  if (!userMinistryRole) return false;

  const roleInfo = MINISTRY_ROLES[userMinistryRole];
  return roleInfo.permissions.includes('all') || roleInfo.permissions.includes(requiredPermission);
}

export function canManageMinistryRole(
  managerRole: MinistryRole | null | undefined,
  targetRole: MinistryRole
): boolean {
  if (!managerRole) return false;

  const managerInfo = MINISTRY_ROLES[managerRole];
  const targetInfo = MINISTRY_ROLES[targetRole];

  // Can manage if user has 'all' permissions or if manager level is higher priority (lower number)
  return managerInfo.permissions.includes('all') ||
         MINISTRY_LEVELS[managerInfo.level].priority <= MINISTRY_LEVELS[targetInfo.level].priority;
}

export function getMinistryRoleOptions(): { value: MinistryRole; label: string; level: MinistryLevel }[] {
  return Object.values(MINISTRY_ROLES).map(role => ({
    value: role.value,
    label: role.label,
    level: role.level
  }));
}

export function getMinistryLevelOptions(): { value: MinistryLevel; label: string }[] {
  return Object.entries(MINISTRY_LEVELS).map(([value, info]) => ({
    value: value as MinistryLevel,
    label: info.label
  }));
}
