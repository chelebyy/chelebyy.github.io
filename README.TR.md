<div align="center">
  <h3>chelebyy:~/acik-kaynak$</h3>
  <p>Açık kaynak projelerim için terminal görünümlü bir ev.</p>

  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-gray?style=for-the-badge&labelColor=333" alt="English"></a>
  <a href="README.TR.md"><img src="https://img.shields.io/badge/Lang-Turkish-blue?style=for-the-badge&labelColor=333" alt="Türkçe"></a>

  <br /><br />

  [![Canlı](https://img.shields.io/badge/canlı-cheleby.me-4f6bff?style=flat-square)](https://cheleby.me)
  [![CI/CD](https://github.com/chelebyy/chelebyy.github.io/actions/workflows/ci-cd.yaml/badge.svg)](https://github.com/chelebyy/chelebyy.github.io/actions)
  [![Lisans](https://img.shields.io/badge/Lisans-MIT-green?style=flat-square)](LICENSE)
</div>

---

## Ne yapar

- **Projeler doğrudan GitHub'dan gelir.** `chelebyy` hesabının herkese açık her deposu açıklaması, dili, lisansı, konuları, yıldızları ve son push tarihiyle otomatik listelenir. Elle yazılmış ya da uydurma veri yoktur.
- **Neyin gizleneceğine sen karar verirsin.** [`src/config/site.ts`](src/config/site.ts) dosyasını düzenle:

  ```ts
  hiddenRepos: ['chelebyy.github.io', 'link-manager', 'StokTakip'], // hiç gösterilmez
  visibleForks: [],      // fork'lar burada listelenmedikçe gizlidir
  showArchived: true,    // arşivlenmiş depolar "arşiv" etiketiyle görünür
  ```

  Adlar büyük/küçük harfe duyarsızdır. Gizlenen depolar proje listesinden *ve* aktivite günlüğünden kaybolur; ziyaretçinin tarayıcısında önbelleğe alınmış veride de.
- **Aktivite günlüğü:** görünen depoların son sürümleri, etiketleri, push'ları ve birleştirilen PR'ları, `git log` biçiminde.
- Proje listesinde **`grep` ve dil filtreleri.**
- Gerçek sayılarla **neofetch paneli:** depo sayısı, yıldızlar, en çok kullanılan diller, son push.
- **Terminal (`Ctrl + K`):** `ls`, `open <proje>`, `neofetch`, `theme <blue|red|green|purple>`, `matrix`, `whoami`, `sudo`, `reboot`, `clear`, `exit`.
- **Efektler:** kısa bir giriş (yaklaşık 1,5 sn, oturum başına bir kez, atlanabilir, hareketi azalt ayarında gösterilmez), Matrix yağmuru, CRT tarama çizgileri (kontrol paneli; üst çubuktaki komut satırına tıkla), ses efektleri.
- **Easter egg:** proje listesinin altındaki `.gizli/` bir şifre istiyor. Sistem günlüğü biliyor.
- İngilizce ve Türkçe; ilk ziyarette tarayıcının dili kullanılır.

GitHub verisi `localStorage`'da 10 dakika saklanır; böylece ziyaretçiler API'nin kimlik doğrulamasız istek sınırının çok altında kalır. GitHub yanıt vermezse sayfa yer tutucu proje göstermek yerine bunu açıkça söyler.

## Geliştirme

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test           # Vitest birim testleri
npm run test:e2e   # Playwright; GitHub API'si e2e/github-stub.ts ile taklit edilir
npm run build
```

Yığın: React 19, Vite 8, Tailwind CSS 4 (derleme zamanında), TypeScript, Vitest, Playwright.

## Yayın

`main`'e yapılan her push lint, tip kontrolü, birim testleri, Playwright testleri ve `npm audit` çalıştırır, ardından derlemeyi GitHub Pages'e (`cheleby.me`) yayınlar.

---

<div align="center">
  <sub><a href="https://github.com/chelebyy">@chelebyy</a> tarafından yapıldı</sub>
</div>
