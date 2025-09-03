#!/usr/bin/env python3
import os
import sys
import math

def get_directory_size(path):
    """
    Belirtilen dizinin ve alt dizinlerinin toplam boyutunu bayt cinsinden hesaplar.
    """
    total_size = 0
    if not os.path.exists(path):
        return 0
    if os.path.isfile(path):
        return os.path.getsize(path)
    
    for dirpath, dirnames, filenames in os.walk(path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            # sembolik bağlantıları takip etmeyin
            if not os.path.islink(fp):
                try:
                    total_size += os.path.getsize(fp)
                except (OSError, FileNotFoundError):
                    # Dosya erişim hatalarını yoksay
                    pass
    return total_size

def convert_bytes_to_human_readable(size_bytes):
    """
    Bayt cinsinden boyutu insan tarafından okunabilir bir formata dönüştürür.
    """
    if size_bytes == 0:
        return "0 B"
    size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return "%s %s" % (s, size_name[i])

def get_file_count(path):
    """
    Dizindeki toplam dosya sayısını hesaplar.
    """
    file_count = 0
    if not os.path.exists(path):
        return 0
    if os.path.isfile(path):
        return 1
    
    for dirpath, dirnames, filenames in os.walk(path):
        file_count += len(filenames)
    return file_count

def analyze_directory_structure(path, max_depth=2):
    """
    Dizin yapısını analiz eder ve en büyük alt dizinleri gösterir.
    """
    subdirs = []
    if not os.path.exists(path) or not os.path.isdir(path):
        return subdirs
    
    try:
        for item in os.listdir(path):
            item_path = os.path.join(path, item)
            if os.path.isdir(item_path) and not os.path.islink(item_path):
                size = get_directory_size(item_path)
                file_count = get_file_count(item_path)
                subdirs.append({
                    'name': item,
                    'size': size,
                    'size_human': convert_bytes_to_human_readable(size),
                    'file_count': file_count
                })
    except PermissionError:
        pass
    
    # Boyuta göre sırala
    subdirs.sort(key=lambda x: x['size'], reverse=True)
    return subdirs[:10]  # En büyük 10 dizini göster

if __name__ == "__main__":
    if len(sys.argv) > 1:
        directory_path = sys.argv[1]
    else:
        directory_path = "."  # Varsayılan olarak mevcut dizin

    print(f"📁 '{directory_path}' dizininin boyutu hesaplanıyor...")
    print("=" * 50)
    
    # Toplam boyut
    size_in_bytes = get_directory_size(directory_path)
    human_readable_size = convert_bytes_to_human_readable(size_in_bytes)
    file_count = get_file_count(directory_path)
    
    print(f"📊 Toplam boyut: {human_readable_size}")
    print(f"📄 Toplam dosya sayısı: {file_count:,}")
    print()
    
    # Alt dizin analizi
    print("📂 En büyük alt dizinler:")
    print("-" * 50)
    subdirs = analyze_directory_structure(directory_path)
    
    if subdirs:
        for i, subdir in enumerate(subdirs, 1):
            print(f"{i:2d}. {subdir['name']:<20} {subdir['size_human']:>10} ({subdir['file_count']:,} dosya)")
    else:
        print("Alt dizin bulunamadı veya erişim izni yok.")
    
    print()
    print("✅ Analiz tamamlandı!")