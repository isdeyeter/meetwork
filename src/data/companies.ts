export interface Company {
  title: string;
  slug: string;
  sector: string;
  color?: string;
  heroIcon?: string;
  location?: string;
  description?: string;
}

export const companies: Company[] = [
  {
    title: 'İş de Yeter',
    slug: 'is-de-yeter',
    sector: 'teknoloji-yazilim',
    color: '#0a84ff',
    heroIcon: '/images/icons/teknoloji-yazilim.svg',
    location: 'Türkiye',
    description: 'Teknoloji, çözüm ve güvenilirlik — web paketleri, ERP/CRM ve dijital hizmetler.'
  },
  {
    title: 'ABC Danışmanlık',
    slug: 'abc-danismanlik',
    sector: 'danismanlik',
    color: '#6f42c1',
    heroIcon: '/images/icons/enerji.svg',
    location: 'Ankara, Türkiye',
    description: 'Kurumsal danışmanlık ve iş geliştirme çözümleri.'
  }
];
