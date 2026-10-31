export const products=[
{id:'1',slug:'dravon-oversized-tee',name:'DRAVON OVERSIZED TEE',price:1799,mrp:2199,tag:'NEW',colors:['Black','White'],sizes:['XS','S','M','L','XL','XXL'],category:'TEES',image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=82',gallery:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=82','https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=82']},
{id:'2',slug:'dravon-performance-tee',name:'DRAVON PERFORMANCE TEE',price:1999,mrp:0,tag:null,colors:['White','Black'],sizes:['S','M','L','XL'],category:'TEES',image:'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=82',gallery:[]},
{id:'3',slug:'training-shorts',name:'TRAINING SHORTS',price:1599,mrp:1899,tag:'SALE',colors:['Black','Grey'],sizes:['S','M','L','XL'],category:'SHORTS',image:'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1200&q=82',gallery:[]},
{id:'4',slug:'street-hoodie',name:'STREET HOODIE',price:3299,mrp:0,tag:'NEW',colors:['Black'],sizes:['S','M','L','XL','XXL'],category:'HOODIES',image:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=82',gallery:[]},
{id:'5',slug:'performance-tank',name:'PERFORMANCE TANK',price:1399,mrp:0,tag:null,colors:['Black','White'],sizes:['XS','S','M','L','XL'],category:'TANKS',image:'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=82',gallery:[]},
{id:'6',slug:'dravon-joggers',name:'JOGGERS',price:2199,mrp:2599,tag:'SALE',colors:['Black'],sizes:['S','M','L','XL','XXL'],category:'BOTTOMS',image:'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=82',gallery:[]},
];
export const skills = [
  { name: 'MUSCLE-UP', slug: 'muscle-up', image: '/images/skills/muscle-up.webp', alt: 'Athlete transitioning over a pull-up bar in a muscle-up', focus: 'PULL · TRANSITION · POWER' },
  { name: 'FRONT LEVER', slug: 'front-lever', image: '/images/skills/front-lever.webp', alt: 'Athlete holding a horizontal front lever on a bar', focus: 'CORE · CONTROL · STRENGTH' },
  { name: 'HANDSTAND', slug: 'handstand', image: '/images/skills/handstand.webp', alt: 'Athlete balancing upside down on straight arms in a handstand', focus: 'BALANCE · CONTROL · FOCUS' },
  { name: 'PLANCHE', slug: 'planche', image: '/images/skills/planche.webp', alt: 'Athlete holding a straight-body planche on parallel bars', focus: 'STRENGTH · LEVERAGE · POWER' },
  { name: 'HUMAN FLAG', slug: 'human-flag', image: '/images/skills/human-flag.webp', alt: 'Athlete holding a horizontal human flag on a vertical pole', focus: 'STRENGTH · CORE · CONTROL' },
  { name: 'BACK LEVER', slug: 'back-lever', image: '/images/skills/back-lever.webp', alt: 'Athlete holding a back lever beneath a bar', focus: 'STRENGTH · FLEXIBILITY · CONTROL' },
  { name: 'L-SIT', slug: 'l-sit', image: '/images/skills/l-sit.webp', alt: 'Athlete holding an L-sit on parallel bars', focus: 'CORE · STRENGTH · ENDURANCE' },
  { name: 'DIPS', slug: 'dips', image: '/images/skills/dips.webp', alt: 'Athlete performing a dip on parallel bars', focus: 'STRENGTH · TRICEPS · POWER' },
];

export const collections = skills.map((skill) => [skill.name, skill.image] as [string, string]);
