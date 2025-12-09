import fs from 'fs';
import path from 'path';

// --- Ayarlar ---
// DİKKAT: Arama yolu artık sadece src/pages/isdeyetercom klasörünü işaret ediyor.
const PAGES_DIR = path.join(process.cwd(), 'src', 'pages', 'isdeyetercom');
const OUTPUT_FILE = 'link_listesi.md';
const ASTRO_FILE_EXTENSION = '.astro';

function extractDataFromAstroFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    let frontmatterTitle = null; // Frontmatter'da sadece başlık bulunursa saklamak için

    // 1. FRONTMATTER KONTROLÜ (Değişkenlerin tanımlı olduğu varsayılan yer)
    const frontmatterMatch = content.match(/---\s*([\s\S]*?)\s*---/);
    if (frontmatterMatch && frontmatterMatch.length >= 2) {
        const frontmatter = frontmatterMatch[1];
        // pageTitle ve originalUrl'ı Frontmatter'dan çek
        const titleMatch = frontmatter.match(/const pageTitle = ["'](.*?)["'];/);
        const urlMatch = frontmatter.match(/const originalUrl = ["'](.*?)["'];/);
        
        if (titleMatch) {
            const extractedTitle = titleMatch[1].trim();
            // URL'yi al veya boş string al
            const extractedUrl = urlMatch ? urlMatch[1].trim() : ''; 
            
            // Eğer başlık ve GEÇERLİ bir URL Frontmatter'da bulunduysa, hemen geri dön.
            if (extractedUrl && extractedUrl !== 'Eksik/Tanımsız') { 
                return {
                    title: extractedTitle,
                    url: extractedUrl
                };
            }
            // Başlık bulundu ama URL eksik/tanımsız ise: Başlığı sakla ve HTML kontrolüne (Adım 2) düş.
            frontmatterTitle = extractedTitle;
        }
    }
    
    // 2. HTML İÇERİĞİ KONTROLÜ (Frontmatter'da eksikse/bulunamadıysa veya URL eksikse)
    
    // URL'yi bul: href="https://isdeyeter.com/..."
    const urlPattern = /href=["'](https?:\/\/isdeyeter\.com\/[^"']+)["']/i;
    const contentUrlMatch = content.match(urlPattern);

    if (contentUrlMatch) {
        const extractedUrl = contentUrlMatch[1];
        
        // Frontmatter'dan gelen başlık varsa onu kullan, yoksa URL'den türet
        let titleToUse = frontmatterTitle;
        
        if (!titleToUse) {
            // Başlık Türetme (URL slug'ından)
            const urlSegments = extractedUrl.split('/');
            let slug = urlSegments[urlSegments.length - 1];
            
            // Linkin sonunda slash varsa bir öncekini al
            if (slug === '' && urlSegments.length > 1) {
                 slug = urlSegments[urlSegments.length - 2];
            }

            // Slug'daki tireleri boşlukla değiştir ve kelime başlarını büyük harfe çevir.
            titleToUse = slug
                .replace(/-/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
                
            titleToUse = titleToUse || `BAŞLIK EKSİK (Dosya: ${path.basename(filePath)})`;
        }

        return {
            title: titleToUse,
            url: extractedUrl,
        };
    }
    
    // 3. FALLBACK (Hiçbir şey bulunamazsa, ancak Frontmatter'da başlık varsa)
    if (frontmatterTitle) {
        return {
            title: frontmatterTitle,
            url: 'Eksik/Tanımsız (HTML veya Frontmatter URL yok)'
        };
    }

    // Frontmatter'da veya HTML içeriğinde geçerli veri bulunamazsa
    return null;
}

function traverseDirectory(dir) {
    let results = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 'api' klasörü ve özel Astro klasörleri atlanır
            if (file !== 'api' && !file.startsWith('.')) {
                results = results.concat(traverseDirectory(filePath));
            }
        } else if (filePath.endsWith(ASTRO_FILE_EXTENSION)) {
            const data = extractDataFromAstroFile(filePath);
            if (data) {
                results.push(data);
            }
        }
    }
    return results;
}

// GÜNCELLENDİ: Markdown tablosu yerine başlık ve link listesi oluşturuluyor.
function generateMarkdownTable(data) {
    let markdown = `# Astro Sayfaları Başlık & Teklif Al Link Listesi\n\n`;
    markdown += `Bu liste, projenizdeki ${data.length} adet Astro dosyasından çıkarılmıştır.\n\n`;
    
    data.forEach((item, index) => {
        // Her öğe için ## Başlık
        markdown += `## ${item.title}\n`;
        
        // Tıklanabilir link: [Teklif Al - ${item.url}](${item.url})
        // Eğer link tanımsızsa, sadece metin olarak göster
        const linkText = item.url.includes('Eksik') 
            ? `**LİNK EKSİK:** ${item.url}`
            : `[Teklif Al: ${item.url}](${item.url})`;
            
        markdown += `${linkText}\n\n`;
        
        // Okunabilirlik için yatay çizgi
        if ((index + 1) % 50 === 0) {
             markdown += `--- \n\n`;
        }
    });

    return markdown;
}

// --- Ana Fonksiyon ---
try {
    console.log(`[BAŞLANGIÇ] Astro sayfaları taranıyor: ${PAGES_DIR}`);
    
    const allExtractedData = traverseDirectory(PAGES_DIR);
    
    if (allExtractedData.length === 0) {
        console.log(`[BİTTİ] Hiçbir Astro dosyasından veri (pageTitle/originalUrl) çıkarılamadı.`);
        console.log("Kontrol edin: Dosyalarınızda 'const pageTitle = ...;' veya HTML içeriğinde 'href=\"https://isdeyeter.com/...' linki var mı?");
        process.exit(0);
    }

    const markdownOutput = generateMarkdownTable(allExtractedData);
    
    fs.writeFileSync(OUTPUT_FILE, markdownOutput, 'utf-8');
    
    console.log(`[BAŞARILI] Toplam ${allExtractedData.length} adet sayfa verisi çıkarıldı.`);
    console.log(`[ÇIKTI] Veriler, projenizin kök dizinindeki '${OUTPUT_FILE}' dosyasına yazıldı.`);

} catch (error) {
    console.error(`[HATA] İşlem sırasında bir sorun oluştu: ${error.message}`);
    if (error.code === 'ENOENT') {
         console.error(`HATA DETAYI: Lütfen 'src/pages/isdeyetercom' klasörünün var olduğundan ve script'i projenizin kök dizininde çalıştırdığınızdan emin olun.`);
    }
}
