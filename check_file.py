# check_file.py
import sys

def check_string_in_file(filepath, search_string):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            if search_string in content:
                print(f"'{search_string}' metni '{filepath}' dosyasında bulundu.")
                return True
            else:
                print(f"'{search_string}' metni '{filepath}' dosyasında bulunamadı.")
                return False
    except FileNotFoundError:
        print(f"Hata: '{filepath}' dosyası bulunamadı.")
        return False
    except Exception as e:
        print(f"Dosya okunurken bir hata oluştu: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Kullanım: python check_file.py <dosya_yolu> <aranacak_metin>")
        sys.exit(1)

    filepath = sys.argv[1]
    search_string = sys.argv[2]
    check_string_in_file(filepath, search_string)
