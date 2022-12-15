export type IconPrefix = "fas" | "fab" | "far" | "fal" | "fad";
export type IconPathData = string | string[]

export interface IconLookup {
  prefix: IconPrefix;
  // IconName is defined in the code that will be generated at build time and bundled with this file.
  iconName: IconName;
}

export interface IconDefinition extends IconLookup {
  icon: [
    number, // width
    number, // height
    string[], // ligatures
    string, // unicode
    IconPathData // svgPathData
  ];
}

export interface IconPack {
  [key: string]: IconDefinition;
}

export type IconName = 'amazon' | 
  'goodreads-g' | 
  'chevron-right' | 
  'times-circle' | 
  'angle-double-left' | 
  'angle-double-right' | 
  'angle-left' | 
  'angle-right' | 
  'book' | 
  'books' | 
  'check' | 
  'check-square' | 
  'cogs' | 
  'eye' | 
  'eye-slash' | 
  'filter' | 
  'home' | 
  'level-up' | 
  'list' | 
  'pencil-alt' | 
  'plus' | 
  'scanner' | 
  'search' | 
  'sign-in' | 
  'sign-out' | 
  'sitemap' | 
  'spinner' | 
  'square' | 
  'sync' | 
  'table' | 
  'tags' | 
  'times' | 
  'times-circle' | 
  'trash-alt' | 
  'undo' | 
  'users-cog' | 
  'angle-double-down' | 
  'angle-double-up' | 
  'angle-down' | 
  'angle-up' | 
  'arrows' | 
  'bars' | 
  'chart-bar' | 
  'check' | 
  'cloud-upload-alt' | 
  'minus' | 
  'pencil' | 
  'plus' | 
  'plus-square' | 
  'question-circle' | 
  'redo' | 
  'save' | 
  'spinner' | 
  'times' | 
  'times-circle' | 
  'trash' | 
  'badge' | 
  'cog' | 
  'th';
