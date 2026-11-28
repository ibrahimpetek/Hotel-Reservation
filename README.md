Hotel Reservation – Otel Rezervasyon Sistemi

Spring Boot ve React ile geliştirilen, misafirlerin tarih seçip oda arayabildiği, rezervasyon yapıp kartla ödeyebildiği, personelin ise yönetim paneliyle odaları, fiyatları ve stoğu yönettiği tam kapsamlı bir otel rezervasyon uygulaması.

Özellikler

Misafir (giriş gerekmez)

Tarih ve kişi sayısına göre müsait oda arama
Pansiyon tipine göre toplam fiyat hesabı
Rezervasyon oluşturma ve iyzico (sandbox) ile ödeme
Rezervasyon koduyla sorgulama

Personel (JWT ile giriş)

ADMIN: oda tipi, fiyat kuralı, günlük stok ve personel yönetimi
RECEPTIONIST: rezervasyonları listeleme ve iptal etme
Teknolojiler
Katman	Teknoloji
Backend	Java 17, Spring Boot, Spring Data JPA, Spring Security (JWT), MapStruct, Lombok
Veritabanı	PostgreSQL 15 (Docker)
Frontend	React, React Router, Axios, Bootstrap 5
Ödeme	iyzico (sandbox)
Proje yapısı
hotel-reservation/
├── hotel-reservation-be/   Spring Boot API
├── hotel-reservation-fe/   React arayüz
├── docs/                   ER diyagramı
├── docker-compose.yml      PostgreSQL servisi
└── .env.example            ortam değişkeni şablonu
Gereksinimler
JDK 17
Node.js 18 veya üzeri
Docker Desktop
Kurulum

1. Ortam dosyasını hazırla

powershell
Copy-Item .env.example .env

.env içindeki DB_PASSWORD değerini kendi şifrenle değiştir.

2. Veritabanını başlat

powershell
docker compose up -d

PostgreSQL, bilgisayarında 5433 portundan erişilebilir olur.

3. Backend'i çalıştır

powershell
cd hotel-reservation-be
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="<.env içindeki şifre>"
.\gradlew bootRun

API http://localhost:8090 adresinde açılır.

4. Frontend'i çalıştır

hotel-reservation-fe klasöründe .env.local adlı bir dosya oluştur:

REACT_APP_API_BASE_URL=http://localhost:8090

Ardından:

powershell
npm install
npm start

Uygulama http://localhost:3000 adresinde açılır.

İlk giriş ve ilk veri

Yönetim paneli: http://localhost:3000/admin/login

E-posta	Şifre
admin@hotel.com	Admin123!

Sistem boş açılır. Misafir ekranında oda görünmesi için sırayla:

Oda Tipleri: en az bir oda tipi ekle
Fiyatlandırma: oda tipi ve pansiyon tipi için tarih aralıklı fiyat ekle
Müsaitlik: tarih aralığı için toplam oda sayısı gir
Veritabanı

ER Diyagramı

Yol haritası
[x] Backend: entity, repository, DTO, mapper, servis katmanı
[x] Frontend: temel yapı ve müşteri ekranları
[ ] Controller katmanı ve uçtan uca test
[ ] Yönetim paneli ekranları
[ ] Backend ve frontend için Dockerfile, tek komutla çalıştırma
Notlar
.env dosyası Git'e eklenmez, şablonu .env.example dosyasıdır.
iyzico anahtarları varsayılan olarak yer tutucudur. Ödemeyi denemek için kendi sandbox anahtarlarını ortam değişkeni olarak ver.