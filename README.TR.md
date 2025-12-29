<div align="center">
  <h3>DIGITAL_ARTIFACTS_OS // SYSTEM_READY</h3>
  <p>Brutalist, siberpunk esintili bir işletim sistemi portfolyo arayüzü.</p>

  <!-- Dil Seçimi (Language Switcher) -->
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-gray?style=for-the-badge&logo=google-translate&labelColor=333" alt="English"></a>
  <a href="README.TR.md"><img src="https://img.shields.io/badge/Lang-Turkish-red?style=for-the-badge&logo=google-translate&labelColor=333" alt="Turkish"></a>

  <br /><br />

  [![Live Demo](https://img.shields.io/badge/LIVE_SYSTEM_ONLINE-00ff00?style=for-the-badge&logo=github&logoColor=black)](https://chelebyy.github.io)
  [![CI/CD](https://github.com/chelebyy/chelebyy.github.io/actions/workflows/ci-cd.yaml/badge.svg)](https://github.com/chelebyy/chelebyy.github.io/actions)

  <br />

  [![React](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Bundled_with-Vite-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat-square&logo=vitest)](https://vitest.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📸 Sistem Görselleri

![System Interface](chelebyy.gif)

> *Güvenli Sektör Erişimi & Matrix Modu Görselleştirmesi*

---

## ⚡ Sistem Genel Bakışı

**Digital Artifacts OS** sadece bir portfolyo web sitesi değildir; mühendislik yeteneklerini ham işlevsellik ve estetikle sergilemek için tasarlanmış etkileşimli bir terminal ortamıdır. Modern web'in gürültüsünü ortadan kaldırarak performansa, etkileşime ve belirgin bir "hacker" havasına odaklanır.

### 🚀 Temel Özellikler

* **🖥️ Komut Paleti (God Mode):**
  * Sistem terminaline erişmek için `Ctrl + K` tuşlarına basın veya "Depoyu_Bagla" butonuna tıklayın.
  * `matrix`, `neofetch`, `theme`, `whoami` gibi komutları çalıştırın.
  * **Sürpriz Yumurta:** `sudo lütfen` yazarak kibarca istemeyi deneyin (veya İngilizce `sudo please`).

* **🟢 Matrix Modu:**
  * Komut paleti üzerinden tamamen render edilmiş HTML5 Canvas Matrix Yağmuru efektini açıp kapatın.
  * *Komut:* `matrix`

* **🔒 Güvenli Sektör:**
  * Hassas veya "gizli" projeler için gizlenmiş, şifre korumalı bir alan.
  * Hayatın anlamı, evren ve her şeye dair kriptik bir kilit açma mekanizması içerir.

* **🎬 Dijital Uyanış (Boot Dizisi):**
  * BIOS kontrolleri, kimlik doğrulama ve glitch efektleri içeren sinematik "Sistem Başlatma" girişi.
  * Rahatsızlık vermeden sürükleyiciliği korumak için oturum başına bir kez çalışır.
  * *Tekrar Deneyimle:* Terminale `reboot` yazarak diziyi yeniden başlatın.

* **📊 Aktif Sistem Monitörü:**
  * Canlı sistem modüllerini (Docker, AI Model, Firewall) görselleştiren yeniden tasarlanmış bir protokol alanı.
  * Sistem durumuna tepki veren dinamik durum göstergeleri (Çalışıyor, Optimize, Filtreleniyor).

* **🌍 Yerelleştirme Desteği:**
  * **İngilizce (EN)** ve **Türkçe (TR)** için tam ikidilli destek.
  * Tüm sistem loglarını, arayüz öğelerini ve hatta komut yanıtlarını güncelleyen anlık dil değişimi.

* **📡 Gerçek Zamanlı Veri:**
  * **Canlı Metrikler:** Gerçek zamanlı RAM dalgalanmaları, CPU kullanım simülasyonu ve Ağ kalp atışı.
  * **GitHub Entegrasyonu:** *Gerçek* commit geçmişini, push olaylarını ve repoları doğrudan GitHub API'sinden çeker.

* **🔊 Sürükleyici Ses Sistemi:**
  * Arayüz genelinde sinematik ses geri bildirimleri.
  * Boot dizisi sesleri, log terminal efektleri ve üzerine gelme (hover) etkileşimleri.
  * Siberpunk atmosferini güçlendiren bağlama duyarlı sesler.

---

## 🏗️ Mimari ve Dağıtım

Bu proje **Clean Architecture** prensiplerini takip eder ve modern bir **CI/CD** hattı kullanır.

### 🔄 Otomatik CI/CD (GitHub Actions)

`main` dalına yapılan her push, otomatik bir iş akışını tetikler:

1. **Test:** 25+ Birim Testi & 9 E2E Testi çalıştırılır.
2. **Derleme (Build):** Uygulama Vite kullanılarak derlenir.
3. **Temiz Sürüm:** Son kullanıcılar için geliştirici dosyalarından arındırılmış temiz bir `.zip` paketi oluşturulur.
4. **Dağıtım (Deploy):** GitHub Pages otomatik olarak güncellenir.

### 🧪 Sistem Bütünlüğü (Testler)

Kapsamlı bir test paketi ile güvenilirliğe öncelik veriyoruz:

* **Birim Testleri (Vitest):** Bireysel bileşenleri kapsar (Header, Sidebar, ProjectCard vb.).
* **E2E Testleri (Playwright):** Kritik kullanıcı akışlarını doğrular (Boot dizisi, Matrix Toggle, Navigasyon).

---

## 🗺️ Cyber Map (Yakında)

* Konum işaretleyicileri ile animasyonlu dünya haritası görselleştirmesi.
* Gerçek zamanlı bağlantı görselleştirme efektleri.

## 🛠️ Kurulum ve Başlatma

Sistemi kendi makinenizde yerel olarak çalıştırın:

```bash
# 1. Depoyu klonlayın
git clone https://github.com/chelebyy/chelebyy.github.io.git

# 2. Dizin içine girin
cd chelebyy.github.io

# 3. Bağımlılıkları yükleyin
npm install

# 4. Sistemi başlatın
npm run dev
```

## ⌨️ Sistem Komutları

`Ctrl + K` ile terminale erişin ve şunları deneyin:

| Komut | Açıklama |
| :--- | :--- |
| `help` | Kullanılabilir komutları listeler |
| `matrix` | Matrix Yağmuru görsel efektini açar/kapatır |
| `neofetch` / `sys` | Detaylı sistem özelliklerini gösterir |
| `theme [renk]` | Sistem vurgu rengini değiştirir (blue, red, green, purple) |
| `contact` | İletişim protokolünü başlatır |
| `reboot` / `restart` | Sistem Başlatma Dizisini (Boot) yeniden başlatır |
| `whoami` | Mevcut kullanıcı kimliğini görüntüler |

## 🤖 Destekleyen Teknolojiler

Bu proje, yeni nesil yapay zeka ajanlarının yardımıyla inşa edilmiştir:

* **Gemini 3.0 Pro:** Hızlı Prototipleme & Arayüz Üretimi
* **Antigravity:** Kod Mimarisi & Ajan İş Akışı
* **Claude:** Derin Muhakeme & Refactoring

---

<div align="center">
  <sub>Designed & Engineered by <a href="https://github.com/chelebyy">@chelebyy</a></sub>
</div>
