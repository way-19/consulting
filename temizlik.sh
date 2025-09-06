#!/bin/bash

# Kullanım: bash temizlik.sh branch-ismi
# Örnek: bash temizlik.sh admin-marketing

BRANCH="$1"

if [ -z "$BRANCH" ]; then
  echo "Branch ismini parametre olarak veriniz!"
  exit 1
fi

# Branch'a geç
git checkout "$BRANCH"

# Kalacak klasör/dosya listesi
KEEP_DIRS=( "apps/admin" "apps/marketing" "apps/consultant" "apps/client" "packages/shared" )
KEEP_FILES=( "package.json" "package-lock.json" "README.md" "tsconfig.json" "tsconfig.app.json" "tsconfig.node.json" "tailwind.config.js" "postcss.config.js" "netlify.toml" ".gitignore" "_redirects" "eslint.config.js" )

echo "Temizlik başlıyor: $BRANCH branchı"

# Tüm dosya ve klasörleri bul
for ITEM in * .*; do
  # "." ve ".." özel dizinlerini atla
  if [ "$ITEM" = "." ] || [ "$ITEM" = ".." ]; then
    continue
  fi

  # Kalacaklar listesinde mi?
  KEEP=false
  for DIR in "${KEEP_DIRS[@]}"; do
    if [ "$ITEM" = "${DIR%%/*}" ]; then
      KEEP=true
      break
    fi
  done
  for FILE in "${KEEP_FILES[@]}"; do
    if [ "$ITEM" = "$FILE" ]; then
      KEEP=true
      break
    fi
  done

  # Silinecekse, sil!
  if [ "$KEEP" = false ]; then
    rm -rf "$ITEM"
    echo "$ITEM silindi."
  fi
done

echo "Temizlik tamamlandı. git status ile kontrol edebilirsin."
echo "Sonrasında:"
echo "  git add ."
echo "  git commit -m \"Temizlik: Gereksiz dosyalar silindi\""
echo "  git push origin $BRANCH"