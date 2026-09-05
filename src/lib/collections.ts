import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { requireDb } from "./firebase";

export type AreaCode = {
  id: string;
  code: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  carrier: string;
  isScam: boolean;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  tags: string[];
  status: "draft" | "published";
  content: string;
  date: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export type SiteSettings = {
  companyName: string;
  supportEmail: string;
  phone: string;
  businessHours: string;
  address: string;
  twitter: string;
  linkedin: string;
};

export const emptySettings: SiteSettings = {
  companyName: "",
  supportEmail: "",
  phone: "",
  businessHours: "",
  address: "",
  twitter: "",
  linkedin: "",
};

/* ---------------- Area codes ---------------- */

export async function listAreaCodes(): Promise<AreaCode[]> {
  const snap = await getDocs(query(collection(requireDb(), "areaCodes"), orderBy("code")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AreaCode, "id">) }));
}

export async function createAreaCode(data: Omit<AreaCode, "id">) {
  await addDoc(collection(requireDb(), "areaCodes"), data);
}

export async function updateAreaCode(id: string, data: Omit<AreaCode, "id">) {
  await updateDoc(doc(requireDb(), "areaCodes", id), data);
}

export async function deleteAreaCode(id: string) {
  await deleteDoc(doc(requireDb(), "areaCodes", id));
}

/* ---------------- Articles ---------------- */

export async function listArticles(): Promise<Article[]> {
  const snap = await getDocs(query(collection(requireDb(), "articles"), orderBy("date", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Article, "id">) }));
}

export async function createArticle(data: Omit<Article, "id">) {
  await addDoc(collection(requireDb(), "articles"), data);
}

export async function updateArticle(id: string, data: Omit<Article, "id">) {
  await updateDoc(doc(requireDb(), "articles", id), data);
}

export async function deleteArticle(id: string) {
  await deleteDoc(doc(requireDb(), "articles", id));
}

/* ---------------- FAQs ---------------- */

export async function listFaqs(): Promise<Faq[]> {
  const snap = await getDocs(query(collection(requireDb(), "faqs"), orderBy("order")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Faq, "id">) }));
}

export async function createFaq(data: Omit<Faq, "id">) {
  await addDoc(collection(requireDb(), "faqs"), data);
}

export async function updateFaq(id: string, data: Partial<Omit<Faq, "id">>) {
  await updateDoc(doc(requireDb(), "faqs", id), data);
}

export async function deleteFaq(id: string) {
  await deleteDoc(doc(requireDb(), "faqs", id));
}

/* ---------------- Settings ---------------- */

export async function getSettings(): Promise<SiteSettings> {
  const snap = await getDoc(doc(requireDb(), "settings", "global"));
  return snap.exists() ? { ...emptySettings, ...(snap.data() as SiteSettings) } : emptySettings;
}

export async function saveSettings(data: SiteSettings) {
  await setDoc(doc(requireDb(), "settings", "global"), data, { merge: true });
}
