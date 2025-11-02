export type MJParams = {
  ar?: string | null;
  stylize?: number | null;
  chaos?: number | null;
  q?: 0.5 | 1 | 2 | null;
  seed?: number | null;
  style?: string | null;
  tile?: boolean | null;
  niji?: boolean | null;
  sref?: string | null;
  cref?: string | null;
  no?: string[] | null;
  stop?: number | null;
  repeat?: number | null;
  version?: string | null;
  stealth?: boolean | null;
  oref?: string | null;
  ow?: number | null;
  profile?: string | null;
  iw?: number | null;
  weird?: number | null;
  draft?: boolean | null;
  raw?: boolean | null;
};

export type Slots = {
  subject?: string;
  camera?: string[];
  composition?: string[];
  lighting?: string[];
  color?: string[];
  style?: string[];
  background?: string[];
};

export type TemplateItem = {
  id: string;
  name: string;
  slots: Slots;
  params: MJParams;
  createdAt: number;
  isFavorite?: boolean;
};

export type SeedSuggestion = {
  seed: number;
  prompt: string;
  tags: string[];
};

export type Wallet = {
  credits: number;
  lastUpdated: number;
};

export type User = {
  id: string;
  email?: string;
  name?: string;
};

