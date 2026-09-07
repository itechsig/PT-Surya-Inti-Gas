/* ─────────────────────────────────────────────────────────────
   contact.ts — SINGLE SOURCE OF TRUTH for company contact info.

   Phone numbers, WhatsApp links, e-mail addresses, postal
   addresses and opening hours used to be re-typed (and drift)
   across Header, Footer, ContactPage, the Chatbot knowledge base
   and several i18n files. Every surface now imports from here.

   `phoneDisplay` — human-readable, for on-screen text
   `phoneE164`    — digits only w/ country code, for tel:/wa.me links
   ───────────────────────────────────────────────────────────── */

export interface Office {
  id: 'sidoarjo' | 'balikpapan';
  /** Short label, e.g. "Kantor Pusat" */
  role: string;
  city: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappUrl: string;
  email: string;
  address: string;
}

export const OFFICES: Record<Office['id'], Office> = {
  sidoarjo: {
    id: 'sidoarjo',
    role: 'Kantor Pusat',
    city: 'Sidoarjo',
    phoneDisplay: '+62 812 3390 6378',
    phoneE164: '6281233906378',
    whatsappUrl: 'https://wa.me/6281233906378',
    email: 'salescounter.sda@suryaintigas.com',
    address:
      'Komp. Perg. & Industri Safe N Lock, Blok V1 - 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM. 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232',
  },
  balikpapan: {
    id: 'balikpapan',
    role: 'Pabrik & Stasiun Pengisian Gas',
    city: 'Balikpapan',
    phoneDisplay: '+62 851 5711 8879',
    phoneE164: '6285157118879',
    whatsappUrl: 'https://wa.me/6285157118879',
    email: 'salescounter.bpn@suryaintigas.com',
    address:
      'Jl. AMD Projakal Kariangau Km. 5.5, RT 046, Kelurahan Graha Indah, Kecamatan Balikpapan Utara, Kota Balikpapan, Kalimantan Timur',
  },
};

/** The office used for generic "contact us" links (header, chatbot, CTAs). */
export const PRIMARY_OFFICE = OFFICES.sidoarjo;

export const SOCIAL = {
  instagram: 'https://www.instagram.com/surya.inti.gas?igsh=MXM3czQyOWx5ZjNzYw==',
  tiktok: 'https://www.tiktok.com/@surya.inti.gas?_r=1&_t=ZS-97WlfSPPexY',
};
