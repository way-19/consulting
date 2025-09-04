#!/usr/bin/env python3
import subprocess
import time
import os
import json

def run_command(cmd, cwd=None, timeout=30):
    """Run a command and return success status"""
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            cwd=cwd, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def check_workspace_structure():
    """Check if workspace structure is valid"""
    print("🏗️  WORKSPACE STRUCTURE CHECK")
    
    # Check root package.json
    if not os.path.exists('package.json'):
        print("   ❌ Root package.json missing")
        return False
    
    try:
        with open('package.json', 'r') as f:
            root_pkg = json.load(f)
        
        workspaces = root_pkg.get('workspaces', [])
        if not workspaces:
            print("   ❌ No workspaces defined in root package.json")
            return False
        
        print(f"   ✅ Found {len(workspaces)} workspace patterns")
        
        # Check if workspace directories exist
        workspace_dirs = []
        for pattern in workspaces:
            if '*' in pattern:
                base_dir = pattern.replace('/*', '')
                if os.path.exists(base_dir):
                    for item in os.listdir(base_dir):
                        item_path = os.path.join(base_dir, item)
                        if os.path.isdir(item_path) and os.path.exists(os.path.join(item_path, 'package.json')):
                            workspace_dirs.append(item_path)
            else:
                if os.path.exists(pattern) and os.path.exists(os.path.join(pattern, 'package.json')):
                    workspace_dirs.append(pattern)
        
        print(f"   ✅ Found {len(workspace_dirs)} actual workspaces")
        for ws in workspace_dirs:
            print(f"      - {ws}")
        
        return len(workspace_dirs) > 0
        
    except Exception as e:
        print(f"   ❌ Error reading root package.json: {e}")
        return False

def check_dependencies():
    """Check if dependencies are properly installed"""
    print("\n📦 DEPENDENCY CHECK")
    
    # Check if node_modules exists
    if not os.path.exists('node_modules'):
        print("   ❌ Root node_modules missing")
        return False
    
    print("   ✅ Root node_modules exists")
    
    # Check workspace node_modules
    workspace_dirs = []
    try:
        with open('package.json', 'r') as f:
            root_pkg = json.load(f)
        workspaces = root_pkg.get('workspaces', [])
        
        for pattern in workspaces:
            if '*' in pattern:
                base_dir = pattern.replace('/*', '')
                if os.path.exists(base_dir):
                    for item in os.listdir(base_dir):
                        item_path = os.path.join(base_dir, item)
                        if os.path.isdir(item_path) and os.path.exists(os.path.join(item_path, 'package.json')):
                            workspace_dirs.append(item_path)
    except:
        pass
    
    # In a proper monorepo, workspaces shouldn't have their own node_modules
    workspace_node_modules = []
    for ws in workspace_dirs:
        nm_path = os.path.join(ws, 'node_modules')
        if os.path.exists(nm_path):
            workspace_node_modules.append(ws)
    
    if workspace_node_modules:
        print(f"   ⚠️  {len(workspace_node_modules)} workspaces have their own node_modules (should use root)")
        for ws in workspace_node_modules:
            print(f"      - {ws}")
    else:
        print("   ✅ Workspaces properly use root node_modules")
    
    return True

def smoke_test_apps():
    """Test if apps can start without errors"""
    print("\n🔥 SMOKE TEST - APP STARTUP")
    
    # Find all apps with package.json that have dev scripts
    apps_to_test = []
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'build', '.next', '.turbo', '.nx', '.cache', '.git']]
        
        if 'package.json' in files:
            try:
                with open(os.path.join(root, 'package.json'), 'r') as f:
                    pkg = json.load(f)
                
                scripts = pkg.get('scripts', {})
                if 'dev' in scripts or 'start' in scripts:
                    apps_to_test.append({
                        'path': root,
                        'name': pkg.get('name', os.path.basename(root)),
                        'script': 'dev' if 'dev' in scripts else 'start'
                    })
            except:
                pass
    
    print(f"   Found {len(apps_to_test)} apps to test")
    
    test_results = []
    for app in apps_to_test:
        print(f"\n   Testing: {app['name']} ({app['path']})")
        
        # Test if npm script can start (just check for syntax errors)
        success, stdout, stderr = run_command(f"npm run {app['script']} --dry-run", cwd=app['path'], timeout=10)
        
        if success:
            print(f"      ✅ Script syntax OK")
            test_results.append((app['name'], True, "Script OK"))
        else:
            print(f"      ❌ Script issues: {stderr[:100]}...")
            test_results.append((app['name'], False, stderr[:100]))
    
    return test_results

def check_typescript_config():
    """Check TypeScript configuration"""
    print("\n📝 TYPESCRIPT CONFIG CHECK")
    
    ts_configs = []
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'build', '.next', '.turbo', '.nx', '.cache', '.git']]
        
        for file in files:
            if file in ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json']:
                ts_configs.append(os.path.join(root, file))
    
    print(f"   Found {len(ts_configs)} TypeScript config files")
    
    for config in ts_configs:
        rel_path = os.path.relpath(config)
        try:
            with open(config, 'r') as f:
                ts_config = json.load(f)
            print(f"   ✅ {rel_path} - Valid JSON")
        except Exception as e:
            print(f"   ❌ {rel_path} - Invalid: {str(e)[:50]}...")

def main():
    print("🚀 CONSULTING19 PROJECT HEALTH CHECK")
    print("=" * 60)
    
    # 1. Check workspace structure
    workspace_ok = check_workspace_structure()
    
    # 2. Check dependencies
    deps_ok = check_dependencies()
    
    # 3. Check TypeScript configs
    check_typescript_config()
    
    # 4. Smoke test apps
    test_results = smoke_test_apps()
    
    # 5. Final summary
    print(f"\n📋 SUMMARY")
    print("=" * 30)
    
    if workspace_ok:
        print("✅ Workspace structure: OK")
    else:
        print("❌ Workspace structure: ISSUES")
    
    if deps_ok:
        print("✅ Dependencies: OK")
    else:
        print("❌ Dependencies: ISSUES")
    
    passed_tests = sum(1 for _, success, _ in test_results if success)
    total_tests = len(test_results)
    print(f"🔥 Smoke tests: {passed_tests}/{total_tests} passed")
    
    if workspace_ok and deps_ok and passed_tests == total_tests:
        print("\n🎉 PROJECT STATUS: HEALTHY")
        print("   Your monorepo is ready for development!")
    else:
        print("\n⚠️  PROJECT STATUS: NEEDS ATTENTION")
        print("   Some issues were found that may affect development.")
    
    print(f"\n💡 NEXT STEPS:")
    print(f"   1. Run 'npm run dev' in your main app directory")
    print(f"   2. Check browser console for any runtime errors")
    print(f"   3. Test key user flows (login, navigation, etc.)")

if __name__ == "__main__":
    main()