DARKHANTECH — исправление путей для GitHub Pages

Проблема: на GitHub изображения находятся в корне репозитория, а HTML/CSS ищет их в папке assets/.

1) Распакуйте архив.
2) GitHub → darkhantech → Add file → Upload files.
3) Перетащите ПЯТЬ файлов из папки: index.html, industrial.html, expeditions.html, sourcing.html, styles.css.
4) Внизу выберите Commit changes (подтвердите замену существующих файлов).
5) В Settings → Pages должно быть: Deploy from a branch, main, /(root).
6) После успешного деплоя перейдите по ссылке из раздела Pages (Visit site).

Весь остальной код, стили и содержание сайта не изменены. Исправлены только относительные пути к изображениям.
Не загружайте сам ZIP в репозиторий: загрузите распакованные пять файлов.
