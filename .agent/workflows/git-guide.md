---
description: Profesyonel GitHub İş Akışı ve CI/CD Rehberi
---

# 🚀 Profesyonel GitHub İş Akışı

Bu workflow Senior Developer standartlarında Git kullanımı ve otomatik CI/CD süreçleri için rehberdir.

## Altın Kurallar 🏆

- 🛑 **ASLA** direkt `main` dalına kod yazma ve pushlama
- 🧪 `main` dalı **%100 çalışan** production-ready kod barındırır
- 🗑️ İşi biten dalı (branch) silmeyi unutma

---

## Branch İsimlendirme Standardı 🌿

Format: `tür/kısa-açıklama`

- ✨ **Yeni Özellik:** `feature/matrix-modu`, `feature/yeni-header`
- 🐛 **Hata Düzeltme:** `fix/mobil-menu-hatasi`, `fix/login-buton`
- 📚 **Dokümantasyon:** `docs/readme-guncelleme`
- 🎨 **Tasarım/Stil:** `style/renk-paleti`, `design/yeni-logo`

---

## Commit Önekleri (Conventional Commits) 📝

| Önek | Anlamı | Örnek |
|------|--------|-------|
| **feat:** | Yeni özellik | `feat: Güvenli sektör girişi eklendi` |
| **fix:** | Hata düzeltme | `fix: Header kayma sorunu çözüldü` |
| **docs:** | Dokümantasyon | `docs: README kurulum adımları` |
| **style:** | Kod stili/CSS | `style: Buton gölgeleri düzenlendi` |
| **refactor:** | Kod iyileştirme | `refactor: App.tsx bileşenlere bölündü` |
| **chore:** | Önemsiz işler | `chore: Gereksiz loglar temizlendi` |

---

## İş Akışı Adımları 🔄

### Adım 1: Hazırlık 🏠

// turbo

```bash
git checkout main
git pull origin main
```

### Adım 2: Yeni Dal Aç 🌿

```bash
git checkout -b feature/yeni-ozellik
```

### Adım 3: Kodla ve Commit At 🛠️

```bash
git add .
git commit -m "feat: Yeni özellik eklendi"
```

### Adım 4: GitHub'a Gönder 🚀

```bash
git push origin feature/yeni-ozellik
```

### Adım 5: Birleştirme (Merge) 🤝

*GitHub arayüzünden "Pull Request" aç.*

> **🤖 DİKKAT (CI/CD Kontrolü):**
> PR açtığında GitHub Actions otomatik çalışır:
>
> 1. **Testleri Çalıştırır:** Hata var mı?
> 2. **Build Alır:** Derleniyor mu?
>
> ❌ Kırmızı ise Merge butonu pasifleşir.
> ✅ Yeşil ise "Squash and Merge" yapabilirsin.

### Adım 6: Temizlik 🧹

```bash
git branch -d feature/yeni-ozellik
```

---

## Release ve Deployment 🚀

**Manuel yükleme yasak.** `main` dalına kod girdiğinde sistem otomatik çalışır:

1. **Auto-Deploy:** Sistem `main` dalını alır, build eder ve GitHub Pages'e yükler.
2. **Test Dosyaları:** GitHub reposunda (Source Code) **GÖRÜNÜR** (geliştiriciler için). Canlı sitede (Production) **GÖRÜNMEZ** (kullanıcılar için).
3. **Clean Release:** Sistem ayrıca son kullanıcılar için **sadece çalışan dosyaları** (testler olmadan) içeren temiz bir `.zip` paketi oluşturur ve Release'e ekler.

---

## SSS ❓

**S: Test dosyaları GitHub commitlerinde görünür mü?**
C: **Evet, görünür.** Görünmelidir de. GitHub Actions robotu bu dosyaları okuyup testi öyle yapar. Diğer geliştiriciler de bu testlere bakıp neyin nasıl çalıştığını anlar. Ancak **son kullanıcı** siteye girdiğinde bu dosyaları görmez.
