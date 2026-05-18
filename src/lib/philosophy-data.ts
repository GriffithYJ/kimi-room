// V2 stub · canon maintainer content (philosophy / concept anchors) stripped.
// Type 留 backwards compat. V2 page rewrite 走 ConceptStore IDB.

export type Concept = {
  slug: string;
  cn: string;
  en: string;
  thinker: string;
  thinkerEn?: string;
  domain: string;
  blurb: string;
  bio: string;
  ideaMain: string;
  inKimi: string;
  yearActive?: string;
};

export const CONCEPTS: Concept[] = [];

export function findConcept(_slug: string): Concept | undefined {
  return undefined;
}
