Bu klasörde sektör bazlı firma sayfaları yer alır.

Nasıl yeni firma eklenir:
1. `src/pages/sablon/firma-sablon-hizmet.astro` veya `src/pages/sablon/firma-sablon-urunlu.astro` dosyasını kopyalayın.
2. Kopyayı ilgili sektöre yapıştırın: `src/pages/firmalar/{sektor}/firma-slug.astro`.
   - Örnek: `src/pages/firmalar/teknoloji-yazilim/is-de-yeter.astro`
3. Kopyaladığınız dosyada `company` objesindeki alanları düzenleyin: `title`, `slug`, `description`, `color`, `heroIcon`, `location`, `services`, `products`, `contact`, `longDescription`.
4. `heroIcon` olarak `public/images/icons/{sektor}.svg` kullanılması performans için uygundur.
5. Sayfa eklendikten sonra `npm run dev` ile yerel sunucuda `/firmalar/{sektor}/{slug}` adresinden kontrol edin.

Arama/rehber sayfası:
- `src/pages/firmalar/search.astro` client-side filtreleme ile örnek veri (`src/data/companies.ts`) kullanır. Üretimde bu veri bir API veya CMS'den sağlanabilir.

Notlar:
- SEO: Her firma sayfası `BaseLayout`'a `title` ve `description` props'u geçer; `description` alanını doldurmak meta tag'lar için önemlidir.
- İkonlar: `public/images/icons/` içine sektör svg'leri ekleyin.
