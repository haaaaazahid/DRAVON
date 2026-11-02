import { SITE_IMAGES } from "@/lib/site-images";
export const skills = [
  { name: 'MUSCLE-UP', slug: 'muscle-up', image: SITE_IMAGES.skills.muscleUp, alt: 'Athlete transitioning over a pull-up bar in a muscle-up', focus: 'PULL · TRANSITION · POWER' },
  { name: 'FRONT LEVER', slug: 'front-lever', image: SITE_IMAGES.skills.frontLever, alt: 'Athlete holding a horizontal front lever on a bar', focus: 'CORE · CONTROL · STRENGTH' },
  { name: 'HANDSTAND', slug: 'handstand', image: SITE_IMAGES.skills.handstand, alt: 'Athlete balancing upside down on straight arms in a handstand', focus: 'BALANCE · CONTROL · FOCUS' },
  { name: 'PLANCHE', slug: 'planche', image: SITE_IMAGES.skills.planche, alt: 'Athlete holding a straight-body planche on parallel bars', focus: 'STRENGTH · LEVERAGE · POWER' },
  { name: 'HUMAN FLAG', slug: 'human-flag', image: SITE_IMAGES.skills.humanFlag, alt: 'Athlete holding a horizontal human flag on a vertical pole', focus: 'STRENGTH · CORE · CONTROL' },
  { name: 'BACK LEVER', slug: 'back-lever', image: SITE_IMAGES.skills.backLever, alt: 'Athlete holding a back lever beneath a bar', focus: 'STRENGTH · FLEXIBILITY · CONTROL' },
  { name: 'L-SIT', slug: 'l-sit', image: SITE_IMAGES.skills.lSit, alt: 'Athlete holding an L-sit on parallel bars', focus: 'CORE · STRENGTH · ENDURANCE' },
  { name: 'DIPS', slug: 'dips', image: SITE_IMAGES.skills.dips, alt: 'Athlete performing a dip on parallel bars', focus: 'STRENGTH · TRICEPS · POWER' },
];

export const collections = skills.map((skill) => [skill.name, skill.image] as [string, string]);
