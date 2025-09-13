#!/usr/bin/env python3
"""
Static Code Analysis for Multi-Method Database Insert Implementation
Analyzes the ClientAccounting component for the new 3-method approach
"""

import re
import json
from typing import Dict, List, Optional, Any
from datetime import datetime

class MultiMethodStaticAnalyzer:
    def __init__(self):
        self.test_results = []
        self.client_accounting_path = '/app/apps/client/src/pages/client/ClientAccounting.tsx'
        
    def log_test(self, test_name: str, success: bool, message: str, details: Optional[Dict] = None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details or {}
        }
        self.test_results.append(result)
        
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"   Details: {json.dumps(details, indent=2)}")

    def read_file_content(self, file_path: str) -> Optional[str]:
        """Read file content safely"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return None
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return None

    def test_method_1_minimal_fields_implementation(self, content: str) -> bool:
        """Test Method 1: Minimal fields implementation"""
        print("\n🔍 Analyzing Method 1: Minimal Fields Implementation...")
        
        # Look for the minimal fields insert pattern
        method1_pattern = r'// Method 1: Minimal required fields only.*?\.from\([\'"`]documents[\'"`]\).*?\.insert\(\s*\{([^}]+)\}\s*\)'
        
        match = re.search(method1_pattern, content, re.DOTALL)
        if not match:
            self.log_test("Method 1 - Pattern Detection", False, "Method 1 minimal fields pattern not found")
            return False
        
        insert_fields = match.group(1)
        
        # Check for required minimal fields
        required_fields = [
            'client_id',
            'consultant_id', 
            'name',
            'type',
            'status',
            'file_url'
        ]
        
        fields_found = []
        for field in required_fields:
            if field in insert_fields:
                fields_found.append(field)
        
        # Check for error handling
        error_handling = 'minimalError' in content and 'console.log' in content
        
        # Check for documentInserted flag control
        flag_control = 'documentInserted = true' in content
        
        success = len(fields_found) == len(required_fields) and error_handling and flag_control
        
        self.log_test("Method 1 - Minimal Fields", success, 
                     f"Method 1 implementation {'verified' if success else 'incomplete'}", {
            'required_fields': required_fields,
            'fields_found': fields_found,
            'missing_fields': [f for f in required_fields if f not in fields_found],
            'error_handling': error_handling,
            'flag_control': flag_control
        })
        
        return success

    def test_method_2_type_casting_implementation(self, content: str) -> bool:
        """Test Method 2: Type casting implementation"""
        print("\n🔍 Analyzing Method 2: Type Casting Implementation...")
        
        # Look for type casting pattern
        method2_pattern = r'// Method 2: If minimal failed, try with explicit string casting.*?\.from\([\'"`]documents[\'"`]\).*?\.insert\(\s*\{([^}]+)\}\s*\)'
        
        match = re.search(method2_pattern, content, re.DOTALL)
        if not match:
            self.log_test("Method 2 - Pattern Detection", False, "Method 2 type casting pattern not found")
            return False
        
        insert_fields = match.group(1)
        
        # Check for type casting functions
        type_casting_patterns = [
            r'String\(',
            r'Number\(',
        ]
        
        casting_found = []
        for pattern in type_casting_patterns:
            if re.search(pattern, insert_fields):
                casting_found.append(pattern.replace('\\(', ''))
        
        # Check for specific field casting
        field_casting_checks = [
            ('name', r'name:\s*String\('),
            ('type', r'type:\s*String\('),
            ('file_size', r'file_size:\s*Number\('),
            ('mime_type', r'mime_type:\s*String\(')
        ]
        
        casted_fields = []
        for field_name, pattern in field_casting_checks:
            if re.search(pattern, insert_fields):
                casted_fields.append(field_name)
        
        # Check for error handling
        error_handling = 'castError' in content
        
        success = len(casting_found) >= 2 and len(casted_fields) >= 3 and error_handling
        
        self.log_test("Method 2 - Type Casting", success,
                     f"Method 2 implementation {'verified' if success else 'incomplete'}", {
            'casting_functions_found': casting_found,
            'casted_fields': casted_fields,
            'error_handling': error_handling
        })
        
        return success

    def test_method_3_upsert_implementation(self, content: str) -> bool:
        """Test Method 3: Upsert implementation"""
        print("\n🔍 Analyzing Method 3: Upsert Implementation...")
        
        # Look for upsert pattern
        method3_pattern = r'// Method 3: If still failed, try upsert instead of insert.*?\.from\([\'"`]documents[\'"`]\).*?\.upsert\(\s*\{([^}]+)\}\s*\)'
        
        match = re.search(method3_pattern, content, re.DOTALL)
        if not match:
            self.log_test("Method 3 - Pattern Detection", False, "Method 3 upsert pattern not found")
            return False
        
        insert_fields = match.group(1)
        
        # Check for UUID generation
        uuid_generation = 'crypto.randomUUID()' in content or 'uuid.uuid4()' in content
        
        # Check for id field in upsert
        id_field = 'id:' in insert_fields
        
        # Check for error handling
        error_handling = 'upsertError' in content
        
        success = uuid_generation and id_field and error_handling
        
        self.log_test("Method 3 - Upsert", success,
                     f"Method 3 implementation {'verified' if success else 'incomplete'}", {
            'uuid_generation': uuid_generation,
            'id_field_present': id_field,
            'error_handling': error_handling
        })
        
        return success

    def test_document_inserted_flag_control(self, content: str) -> bool:
        """Test documentInserted flag controls task/alert creation"""
        print("\n🔍 Analyzing documentInserted flag control...")
        
        # Check for flag initialization
        flag_init = 'documentInserted = false' in content
        
        # Check for flag setting in each method
        flag_settings = content.count('documentInserted = true')
        
        # Check for conditional task creation
        task_condition = re.search(r'if\s*\(\s*documentInserted.*?\)\s*\{.*?tasks.*?insert', content, re.DOTALL)
        
        # Check for conditional alert creation  
        alert_condition = re.search(r'if\s*\(\s*documentInserted.*?\)\s*\{.*?consultant_alerts.*?insert', content, re.DOTALL)
        
        # Check for failure handling
        failure_handling = 'All database insert methods failed' in content
        
        success = flag_init and flag_settings >= 3 and task_condition and alert_condition and failure_handling
        
        self.log_test("DocumentInserted Flag Control", success,
                     f"Flag control {'properly implemented' if success else 'incomplete'}", {
            'flag_initialization': flag_init,
            'flag_settings_count': flag_settings,
            'task_conditional': bool(task_condition),
            'alert_conditional': bool(alert_condition),
            'failure_handling': failure_handling
        })
        
        return success

    def test_log_privacy_action_error_handling(self, content: str) -> bool:
        """Test handling of log_privacy_action trigger error"""
        print("\n🔍 Analyzing log_privacy_action error handling...")
        
        # Check for Turkish error message handling (tip uyumsuzluğu)
        turkish_error = 'uyumsuzluğu' in content or 'tip uyumsuzluğu' in content
        
        # Check for multiple method fallback
        method_fallback = content.count('if (!documentInserted)') >= 2
        
        # Check for error logging
        error_logging = content.count('console.log') >= 6  # Should have logging for each method
        
        # Check for graceful degradation
        graceful_degradation = 'throw new Error' in content and 'All database insert methods failed' in content
        
        success = method_fallback and error_logging and graceful_degradation
        
        self.log_test("Log Privacy Action Error Handling", success,
                     f"Error handling {'properly implemented' if success else 'needs improvement'}", {
            'turkish_error_reference': turkish_error,
            'method_fallback': method_fallback,
            'error_logging': error_logging,
            'graceful_degradation': graceful_degradation
        })
        
        return success

    def test_task_and_alert_creation_after_insert(self, content: str) -> bool:
        """Test task and alert creation after successful document insert"""
        print("\n🔍 Analyzing task and alert creation after document insert...")
        
        # Check for task creation
        task_creation = re.search(r'\.from\([\'"`]tasks[\'"`]\).*?\.insert\(\s*\{([^}]+)\}\s*\)', content, re.DOTALL)
        
        # Check for alert creation
        alert_creation = re.search(r'\.from\([\'"`]consultant_alerts[\'"`]\).*?\.insert\(\s*\{([^}]+)\}\s*\)', content, re.DOTALL)
        
        # Check for proper consultant_id usage
        consultant_id_usage = content.count('clientData.assigned_consultant_id') >= 4
        
        # Check for task fields
        task_fields = ['title', 'description', 'type', 'status', 'due_date'] if task_creation else []
        task_fields_found = [field for field in task_fields if field in task_creation.group(1)] if task_creation else []
        
        # Check for alert fields
        alert_fields = ['alert_type', 'message', 'is_resolved'] if alert_creation else []
        alert_fields_found = [field for field in alert_fields if field in alert_creation.group(1)] if alert_creation else []
        
        success = bool(task_creation) and bool(alert_creation) and consultant_id_usage and len(task_fields_found) >= 4 and len(alert_fields_found) >= 3
        
        self.log_test("Task and Alert Creation", success,
                     f"Task and alert creation {'properly implemented' if success else 'incomplete'}", {
            'task_creation': bool(task_creation),
            'alert_creation': bool(alert_creation),
            'consultant_id_usage': consultant_id_usage,
            'task_fields_found': task_fields_found,
            'alert_fields_found': alert_fields_found
        })
        
        return success

    def test_complete_multi_method_implementation(self, content: str) -> bool:
        """Test the complete multi-method implementation"""
        print("\n🔍 Analyzing complete multi-method implementation...")
        
        # Run all individual tests
        method1_ok = self.test_method_1_minimal_fields_implementation(content)
        method2_ok = self.test_method_2_type_casting_implementation(content)
        method3_ok = self.test_method_3_upsert_implementation(content)
        flag_control_ok = self.test_document_inserted_flag_control(content)
        error_handling_ok = self.test_log_privacy_action_error_handling(content)
        task_alert_ok = self.test_task_and_alert_creation_after_insert(content)
        
        # Overall success
        success = method1_ok and method2_ok and method3_ok and flag_control_ok and error_handling_ok and task_alert_ok
        
        self.log_test("Complete Multi-Method Implementation", success,
                     f"Multi-method implementation {'fully verified' if success else 'has issues'}", {
            'method_1_minimal': method1_ok,
            'method_2_casting': method2_ok,
            'method_3_upsert': method3_ok,
            'flag_control': flag_control_ok,
            'error_handling': error_handling_ok,
            'task_alert_creation': task_alert_ok,
            'overall_score': f"{sum([method1_ok, method2_ok, method3_ok, flag_control_ok, error_handling_ok, task_alert_ok])}/6"
        })
        
        return success

    def run_analysis(self) -> Dict[str, Any]:
        """Run complete static analysis"""
        print("🚀 Starting Multi-Method Database Insert Static Analysis")
        print("=" * 70)
        
        content = self.read_file_content(self.client_accounting_path)
        if not content:
            self.log_test("File Access", False, "Could not read ClientAccounting.tsx file")
            return self.get_summary()
        
        self.log_test("File Access", True, "ClientAccounting.tsx file loaded successfully")
        
        # Run complete analysis
        self.test_complete_multi_method_implementation(content)
        
        return self.get_summary()

    def get_summary(self) -> Dict[str, Any]:
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
        print("📊 MULTI-METHOD STATIC ANALYSIS SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {summary['success_rate']:.1f}%")
        
        if passed_tests > 0:
            print("\n✅ PASSED TESTS:")
            for result in self.test_results:
                if result['success']:
                    print(f"   • {result['test']}")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        return summary

def main():
    """Main analysis execution"""
    analyzer = MultiMethodStaticAnalyzer()
    summary = analyzer.run_analysis()
    
    return 0 if summary['failed'] == 0 else 1

if __name__ == "__main__":
    exit(main())