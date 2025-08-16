# TaskFlow — FULL (Frontend + Backend)

## Struktur
- `frontend/` — React app (untuk developer, ada `package.json` + script build otomatis copy ke backend)
- `taskflow-backend/` — PHP API untuk XAMPP/Docker (punya `api/`, `config/`, `sql/`, dst.)

## Jalankan (Mode Developer)
1. Start XAMPP: Apache + MySQL.
2. Import DB:
   - Buka phpMyAdmin → buat DB `taskflow_db`
   - Import `taskflow-backend/sql/schema.sql`
3. Backend:
   - Taruh `taskflow-backend/` di `C:\xampp\htdocs\taskflow-backend\` (Windows)
   - Test endpoint publik: `http://localhost/taskflow-backend/api/public/projects.php`
4. Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   FE akan call API ke `http://localhost/taskflow-backend/api` (lihat `frontend/utils/config.js`).

## Jalankan (Deploy ke XAMPP dari FE build)
```bash
cd frontend
npm install
npm run build
```
Hasil build akan **otomatis** dicopy ke `taskflow-backend/public/`.
Akses FE langsung via Apache:
```
http://localhost/taskflow-backend/public/
```

## Docker
### Backend
```bash
docker build -t taskflow-backend ./taskflow-backend
docker run -p 8080:80 taskflow-backend
```
### Frontend
```bash
docker build -t taskflow-frontend ./frontend
docker run -p 3000:80 taskflow-frontend
```

## Login awal
- Username: `admin`
- Password: `admin123`
(Sudah disediakan seed di `taskflow-backend/sql/schema.sql` — jika belum ada, jalankan seed dari SQL tersebut.)