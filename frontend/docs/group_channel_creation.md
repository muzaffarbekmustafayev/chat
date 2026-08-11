# Guruh va Kanal Yaratish Bo'yicha Texnik Hujjat (Design & Architecture)

Ushbu hujjat **Senior UI/UX Dizayner** va **Frontend Dasturchi** nigohi bilan yozilgan bo'lib, ilovada Yangi Guruh (Group) va Kanal (Channel) yaratish oynalarining (Modal) interfeysi, dizayn tizimi va backend bilan integratsiya qilish mantig'ini tushuntirib beradi.

---

## 1. Dizayn Falsafasi (Ultra Premium Glassmorphism)

Foydalanuvchi "Yangi suhbat" tugmasini bosganida ochiladigan oyna (`NewChatModal`) to'liq **Glassmorphism** uslubida qurilgan.

### 1.1. Asosiy Elementlar:
- **Fon (Backdrop)**: Oyna foni o'ta xira qora emas, balki `bg-tg-900/60 backdrop-blur-[8px]` orqali biroz shaffof qilingan. Bu orqadagi chat oynasidagi gloving elementlarning bilinar-bilinmas o'tib turishini (depth) ta'minlaydi.
- **Oyna (Card)**: Karta atrofida `border-white/10` orqali yupqa oq chiziq berilgan. Karta ichidagi yuqoridan pastga qarab yo'nalgan gradient (`bg-gradient-to-b from-white/5 to-transparent`) unga premium yorqinlik (inner glow) beradi.
- **Tablar (Segmented Control)**: Shaxsiy va Guruh tablari orasida o'tish an'anaviy radio-tugmalar kabi emas, iOS tizimiga xos bo'lgan "Segmented Control" ko'rinishida yasalgan. Faol tab `shadow-lg border-white/10` bilan ajralib turadi.
- **Hover Effektlari (Yangi Qoida)**: Tugmalar ustiga borganda ularning hajmi kattalashmasligi (`hover:scale` olib tashlangan) ta'minlandi. Bu oyna va elementlarning chayqalib, sakrab turishini oldini olib, UI'ni ko'proq stabil va professional (Native-like) ko'rinishga keltirdi.

---

## 2. Guruh Yaratish (Group Creation)

Guruh yaratish jarayoni foydalanuvchidan ortiqcha sahifalarga o'tishni talab qilmaydi. Hamma ish bitta kichkina va aqlli modal ichida hal bo'ladi.

### 2.1. Qadamlar:
1. **Guruh nomini kiritish**: Tab `Guruh` ga o'zgartirilganda birinchi bo'lib guruh nomi kiritiladigan maxsus yoritiluvchi (glow focus) input maydoni chiqadi.
2. **A'zolarni tanlash (Multi-select)**: Barcha mavjud foydalanuvchilar ro'yxati chiqadi. Ularning ustiga bosilganda o'ng tarafda kichik `checkbox` orqali belgilanishi ta'minlangan. Foydalanuvchi bir nechta a'zoni tanlashi mumkin. Tanlangan a'zolar elementi och ko'k rangda (`bg-tg-accent/10 border-tg-accent/40`) yoritiladi.
3. **Tasdiqlash**: Tanlangan foydalanuvchilar soni pastki asosiy tugmada dinamik ravishda ko'rinib turadi (masalan: *Guruh yaratish (3)*).
4. **Backend So'rovi**:
   ```javascript
   api.post('/chats/group', {
     name: "Dasturchilar guruhi",
     participantIds: ["id1", "id2", "id3"]
   })
   ```
   So'rov ketganda tugmada kutish animatsiyasi (spinner) aylanadi va yaratish jarayoni bloklanib, xato takrorlanishining oldi olinadi.

---

## 3. Kanal Yaratish (Channel Creation) - Reja va Arxitektura

Hozirgi vaqtda ilovada faqat "Shaxsiy chat" va "Guruh" yaratish yoqilgan. Kelgusida "Kanal yaratish" funksiyasini qo'shish uchun quyidagi me'moriy reja (Architecture) tasdiqlangan:

### 3.1. UI (Frontend) o'zgarishlari:
- `NewChatModal` dagi Segmented Control (Tab) qismiga uchinchi bo'lim sifatida **Kanal** (`HiSpeakerphone` belgisi bilan) qo'shiladi.
- Kanal yaratish Guruh yaratishga juda o'xshaydi, asosiy farqi:
  - Kanalda a'zolarni tanlash ixtiyoriy (majburiy emas).
  - Kanal turi (Ochiq yoki Yopiq) degan Switch/Toggle elementi qo'shiladi.
  - Kanal tavsifi (Description) kiritish uchun qator qo'shiladi.

### 3.2. Data Model (Backend) o'zgarishlari:
Chat modeliga (Schema) qo'shimcha maydonlar kerak bo'ladi:
- `type: 'channel'` qo'shilishi kerak.
- `admins`: [UserId] massivi (Kanalga xabar yozish huquqiga ega bo'lganlar).
- Oddiy foydalanuvchilar kanalda xabar yoza olmaydi, faqat o'qiy oladi.

---

## 4. Xulosa

Hozirgi `NewChatModal` tuzilishi kelajakda boshqa turdagi chatlarni qo'shish uchun ham bemalol kengaytirilishi mumkin (Scalable UI). Komponentlarning ortiqcha kattalashib ketish (hover scale) effektlarisiz ishlatilishi, Premium dasturlardagi jiddiylik va stabillikni ta'minlaydi.
