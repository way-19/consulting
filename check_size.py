#!/usr/bin/env python3
"""
File size checker for Consulting19 project
Analyzes file sizes and provides recommendations for optimization
"""

import os
import sys
from pathlib import Path
from typing import List, Tuple, Dict

def get_file_size(file_path: Path) -> int:
    """Get file size in bytes"""
    try:
        return file_path.stat().st_size
    except (OSError, FileNotFoundError):
        return 0

def format_size(size_bytes: int) -> str:
    """Format bytes to human readable format"""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"

def analyze_directory(directory: Path, extensions: List[str] = None) -> Dict:
    """Analyze directory for file sizes"""
    if extensions is None:
        extensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.sql', '.json', '.md']
    
    files = []
    total_size = 0
    
    for file_path in directory.rglob('*'):
        if file_path.is_file() and file_path.suffix in extensions:
            # Skip node_modules and dist directories
            if 'node_modules' in file_path.parts or 'dist' in file_path.parts:
                continue
                
            size = get_file_size(file_path)
            total_size += size
            
            files.append({
                'path': file_path,
                'size': size,
                'formatted_size': format_size(size)
            })
    
    # Sort by size (largest first)
    files.sort(key=lambda x: x['size'], reverse=True)
    
    return {
        'files': files,
        'total_size': total_size,
        'total_formatted': format_size(total_size),
        'file_count': len(files)
    }

def check_large_files(files: List[Dict], threshold_kb: int = 200) -> List[Dict]:
    """Find files larger than threshold"""
    threshold_bytes = threshold_kb * 1024
    return [f for f in files if f['size'] > threshold_bytes]

def analyze_project():
    """Main analysis function"""
    project_root = Path('.')
    
    print("🔍 Consulting19 Project Size Analysis")
    print("=" * 50)
    
    # Analyze different parts of the project
    sections = {
        'Marketing App': 'apps/marketing/src',
        'Admin App': 'apps/admin/src', 
        'Client App': 'apps/client/src',
        'Consultant App': 'apps/consultant/src',
        'Dashboard App': 'apps/dashboard/src',
        'Shared Package': 'packages/shared/src',
        'Supabase Functions': 'supabase/functions'
    }
    
    total_project_size = 0
    all_large_files = []
    
    for section_name, section_path in sections.items():
        section_dir = project_root / section_path
        
        if not section_dir.exists():
            print(f"\n📁 {section_name}: Directory not found")
            continue
            
        analysis = analyze_directory(section_dir)
        total_project_size += analysis['total_size']
        
        print(f"\n📁 {section_name}")
        print(f"   Total Size: {analysis['total_formatted']}")
        print(f"   File Count: {analysis['file_count']}")
        
        # Check for large files in this section
        large_files = check_large_files(analysis['files'], 200)
        if large_files:
            print(f"   ⚠️  Large Files (>200KB):")
            for file_info in large_files[:3]:  # Show top 3
                rel_path = file_info['path'].relative_to(project_root)
                print(f"      - {rel_path}: {file_info['formatted_size']}")
            all_large_files.extend(large_files)
    
    print(f"\n📊 Project Summary")
    print("=" * 30)
    print(f"Total Project Size: {format_size(total_project_size)}")
    print(f"Large Files Found: {len(all_large_files)}")
    
    # Show top 10 largest files across entire project
    if all_large_files:
        print(f"\n🔥 Top 10 Largest Files:")
        all_large_files.sort(key=lambda x: x['size'], reverse=True)
        for i, file_info in enumerate(all_large_files[:10], 1):
            rel_path = file_info['path'].relative_to(project_root)
            print(f"   {i:2d}. {rel_path}: {file_info['formatted_size']}")
    
    # Recommendations
    print(f"\n💡 Recommendations:")
    if len(all_large_files) > 0:
        print("   - Consider splitting large files into smaller modules")
        print("   - Review if any files contain unnecessary code")
        print("   - Check for duplicate code that can be extracted")
    else:
        print("   - File sizes look good! No large files detected.")
    
    # Check for potential issues
    print(f"\n🔍 Potential Issues:")
    
    # Check for very large TypeScript files
    large_ts_files = [f for f in all_large_files if f['path'].suffix in ['.ts', '.tsx'] and f['size'] > 300 * 1024]
    if large_ts_files:
        print(f"   ⚠️  {len(large_ts_files)} TypeScript files > 300KB")
    
    # Check for large JSON files
    large_json_files = [f for f in all_large_files if f['path'].suffix == '.json' and f['size'] > 100 * 1024]
    if large_json_files:
        print(f"   ⚠️  {len(large_json_files)} JSON files > 100KB")
    
    if not large_ts_files and not large_json_files:
        print("   ✅ No major size issues detected")

def main():
    """Main entry point"""
    if len(sys.argv) > 1:
        if sys.argv[1] == '--help' or sys.argv[1] == '-h':
            print("Usage: python check_size.py [--help]")
            print("Analyzes file sizes in the Consulting19 project")
            return
    
    try:
        analyze_project()
    except KeyboardInterrupt:
        print("\n\n⏹️  Analysis interrupted by user")
    except Exception as e:
        print(f"\n❌ Error during analysis: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()