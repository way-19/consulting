import os

def get_dir_size(path='.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            if not os.path.islink(fp):
                total_size += os.path.getsize(fp)
    return total_size

def format_size(size):
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0

print("Calculating directory sizes. This might take a moment...")

current_dir = os.getcwd()
print(f"Total size of {current_dir}: {format_size(get_dir_size(current_dir))}\n")

print("Top 10 largest subdirectories:")
subdirs = []
for item in os.listdir(current_dir):
    item_path = os.path.join(current_dir, item)
    if os.path.isdir(item_path):
        subdirs.append((item, get_dir_size(item_path)))

subdirs.sort(key=lambda x: x[1], reverse=True)

for name, size in subdirs[:10]:
    print(f"{format_size(size)}\t{name}")

