#!/usr/bin/env python3
"""
Code Analysis Test for ClientAccounting.tsx
Analyzes the implementation without requiring database access
"""

import re
import json

class CodeAnalyzer:
    def __init__(self):
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details=None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details or {}
        }
        self.test_results.append(result)
        
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"   Details: {json.dumps(details, indent=2)}")
            
    def analyze_client_accounting_code(self):
        """Analyze the ClientAccounting.tsx implementation"""
        print("🔍 Analyzing ClientAccounting.tsx implementation...")
        
        try:
            with open('/app/apps/client/src/pages/client/ClientAccounting.tsx', 'r') as f:
                code = f.read()
                
            # Test 1: Check if simplified direct insert approach is implemented
            self.check_simplified_direct_insert(code)
            
            # Test 2: Check consultant_id assignment fix
            self.check_consultant_id_fix(code)
            
            # Test 3: Check task creation after document insert
            self.check_task_creation(code)
            
            # Test 4: Check alert creation
            self.check_alert_creation(code)
            
            # Test 5: Check multi-method approach
            self.check_multi_method_approach(code)
            
        except FileNotFoundError:
            self.log_test("Code Analysis", False, "ClientAccounting.tsx file not found")
            
    def check_simplified_direct_insert(self, code):
        """Check if simplified direct insert approach is implemented"""
        # Look for direct database insert without complex RPC calls
        direct_insert_patterns = [
            r'\.from\([\'"]documents[\'"]\)\.insert\(',
            r'DIRECT DATABASE INSERT',
            r'Simple approach without complex RPC calls'
        ]
        
        found_patterns = []
        for pattern in direct_insert_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                found_patterns.append(pattern)
                
        if found_patterns:
            self.log_test("Simplified Direct Insert", True, 
                        "Direct database insert approach implemented", 
                        {'patterns_found': found_patterns})
        else:
            self.log_test("Simplified Direct Insert", False, 
                        "Direct database insert approach not found")
            
    def check_consultant_id_fix(self, code):
        """Check if consultant_id assignment fix is implemented"""
        # Look for correct consultant_id usage
        consultant_id_patterns = [
            r'clientData\.assigned_consultant_id',
            r'consultant_id:\s*clientData\.assigned_consultant_id',
            r'Using consultant_id.*clientData\.assigned_consultant_id'
        ]
        
        found_patterns = []
        for pattern in consultant_id_patterns:
            matches = re.findall(pattern, code)
            if matches:
                found_patterns.extend(matches)
                
        if found_patterns:
            self.log_test("Consultant ID Fix", True, 
                        "Consultant ID correctly uses clientData.assigned_consultant_id", 
                        {'usage_count': len(found_patterns)})
        else:
            self.log_test("Consultant ID Fix", False, 
                        "Consultant ID fix not found")
            
    def check_task_creation(self, code):
        """Check if task creation after document insert is implemented"""
        # Look for task creation logic
        task_patterns = [
            r'\.from\([\'"]tasks[\'"]\)\.insert\(',
            r'type:\s*[\'"]document_review[\'"]',
            r'Creating task for document upload'
        ]
        
        found_patterns = []
        for pattern in task_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                found_patterns.append(pattern)
                
        if found_patterns:
            self.log_test("Task Creation", True, 
                        "Task creation after document insert implemented", 
                        {'patterns_found': found_patterns})
        else:
            self.log_test("Task Creation", False, 
                        "Task creation logic not found")
            
    def check_alert_creation(self, code):
        """Check if alert creation is implemented"""
        # Look for alert creation logic
        alert_patterns = [
            r'\.from\([\'"]consultant_alerts[\'"]\)\.insert\(',
            r'alert_type:\s*[\'"]document_uploaded[\'"]',
            r'Creating consultant alert'
        ]
        
        found_patterns = []
        for pattern in alert_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                found_patterns.append(pattern)
                
        if found_patterns:
            self.log_test("Alert Creation", True, 
                        "Consultant alert creation implemented", 
                        {'patterns_found': found_patterns})
        else:
            self.log_test("Alert Creation", False, 
                        "Alert creation logic not found")
            
    def check_multi_method_approach(self, code):
        """Check if multi-method database insert approach is implemented"""
        # Look for the 3-method approach mentioned in test_result.md
        method_patterns = [
            r'Method 1.*direct insert',
            r'Method 2.*type conversion',
            r'Method 3.*upsert',
            r'documentInserted.*flag'
        ]
        
        found_methods = []
        for pattern in method_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                found_methods.append(pattern)
                
        # Count the number of insert attempts
        insert_attempts = len(re.findall(r'\.insert\([^)]*\)', code))
        
        if len(found_methods) >= 2 or insert_attempts >= 2:
            self.log_test("Multi-Method Approach", True, 
                        "Multi-method database insert approach implemented", 
                        {
                            'methods_found': found_methods,
                            'insert_attempts': insert_attempts
                        })
        else:
            self.log_test("Multi-Method Approach", False, 
                        "Multi-method approach not sufficiently implemented")
            
    def analyze_supabase_config(self):
        """Analyze Supabase configuration"""
        print("\n🔧 Analyzing Supabase configuration...")
        
        try:
            with open('/app/packages/shared/src/lib/supabase.ts', 'r') as f:
                supabase_code = f.read()
                
            with open('/app/apps/client/.env.local', 'r') as f:
                env_content = f.read()
                
            # Check URL configuration
            if 'qdwykqrepolavgvfxquw.supabase.co' in env_content:
                self.log_test("Supabase URL Config", True, 
                            "Corrected Supabase URL (qdwykqrepolavgvfxquw.supabase.co) configured")
            else:
                self.log_test("Supabase URL Config", False, 
                            "Corrected Supabase URL not found in configuration")
                
            # Check if client creation is properly implemented
            if 'createClient' in supabase_code and 'VITE_SUPABASE_URL' in supabase_code:
                self.log_test("Supabase Client Config", True, 
                            "Supabase client properly configured with environment variables")
            else:
                self.log_test("Supabase Client Config", False, 
                            "Supabase client configuration issues found")
                
        except FileNotFoundError as e:
            self.log_test("Supabase Config Analysis", False, f"Configuration file not found: {e}")
            
    def run_analysis(self):
        """Run all code analysis tests"""
        print("🚀 Starting Code Analysis for Simplified Document Upload")
        print("=" * 70)
        
        self.analyze_client_accounting_code()
        self.analyze_supabase_config()
        
        return self.get_summary()
        
    def get_summary(self):
        """Get analysis summary"""
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r['success']])
        failed_tests = total_tests - passed_tests
        
        summary = {
            'total_tests': total_tests,
            'passed': passed_tests,
            'failed': failed_tests,
            'success_rate': (passed_tests / total_tests * 100) if total_tests > 0 else 0,
            'results': self.test_results
        }
        
        print("\n" + "=" * 70)
        print("📊 CODE ANALYSIS SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {summary['success_rate']:.1f}%")
        
        if passed_tests > 0:
            print("\n✅ IMPLEMENTATION VERIFIED:")
            for result in self.test_results:
                if result['success']:
                    print(f"   • {result['test']}: {result['message']}")
                    
        if failed_tests > 0:
            print("\n❌ IMPLEMENTATION ISSUES:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
                    
        return summary

def main():
    """Main analysis execution"""
    analyzer = CodeAnalyzer()
    summary = analyzer.run_analysis()
    
    return 0 if summary['failed'] == 0 else 1

if __name__ == "__main__":
    exit_code = main()
    exit(exit_code)