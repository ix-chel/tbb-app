# Folder QR Codes

Folder ini digunakan sebagai redirect untuk gambar QR code yang disimpan di storage.

## Struktur File

- `.gitkeep` - File untuk memastikan folder tetap ada di repository
- `.htaccess` - Konfigurasi redirect ke storage
- `README.md` - Dokumentasi folder ini

## Path URL

- QR code images dapat diakses melalui: `/storage/qrcodes/{id}.png`
- Placeholder image dapat diakses melalui: `/storage/qrcodes/placeholder.png`

## Penggunaan

Folder ini berfungsi sebagai redirect ke storage:
1. File QR code disimpan di `storage/app/public/qrcodes/`
2. Diakses melalui URL `/storage/qrcodes/{id}.png`
3. Folder ini mengarahkan request ke storage yang benar

## Permissions

Pastikan folder ini memiliki permission write untuk aplikasi web server. 