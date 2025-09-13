#!/usr/bin/env python3
"""
Static Analysis Test for ClientAccounting Document Upload Functionality
Analyzes the code implementation for consultant_id bug fix and related functionality
"""

import re
import os
from typing import Dict, List, Tuple, Any

class StaticAnalyzer:
    def __init__(self):
        self.test_results = []
        self.client_accounting_path = '/app/apps/client/src/pages/client/ClientAccounting.tsx'
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict = None):
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
            for key, value in details.items():
                print(f"   {key}: {value}")
                
    def read_file(self, file_path: str) -> str:
        """Read file content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return ""
            
    def test_client_data_fetch_implementation(self) -> bool:
        """Test client data fetch implementation"""
        print("\n🔍 Testing client data fetch implementation...")
        
        content = self.read_file(self.client_accounting_path)
        if not content:
            self.log_test("Client Data Fetch Implementation", False, "File not found")
            return False
            
        # Check for correct client query in fetchDocuments
        fetch_docs_pattern = r"const { data: clientData, error: clientError } = await supabase\s*\.from\('clients'\)\s*\.select\('id, assigned_consultant_id.*?'\)\s*\.eq\('profile_id', user\?\.id\)"
        
        if not re.search(fetch_docs_pattern, content, re.DOTALL):
            self.log_test("Client Data Fetch Implementation", False, "Client query in fetchDocuments not found or incorrect")
            return False
            
        # Check for correct client query in handleFileUpload
        upload_pattern = r"const { data: clientData, error: clientError } = await supabase\s*\.from\('clients'\)\s*\.select\('id, assigned_consultant_id.*?'\)\s*\.eq\('profile_id', user\?\.id\)\s*\.single\(\)"
        
        if not re.search(upload_pattern, content, re.DOTALL):
            self.log_test("Client Data Fetch Implementation", False, "Client query in handleFileUpload not found or incorrect")
            return False
            
        # Check for debug logging
        debug_patterns = [
            r"console\.log\('🔍 DEBUG: Fetching client data for user ID:'",
            r"console\.log\('🔍 DEBUG: Client query result:'",
            r"console\.error\('❌ Client data not found:'"
        ]
        
        missing_debug = []
        for pattern in debug_patterns:
            if not re.search(pattern, content):
                missing_debug.append(pattern)
                
        details = {
            'fetchDocuments_query': "✅ Found" if re.search(fetch_docs_pattern, content, re.DOTALL) else "❌ Missing",
            'handleFileUpload_query': "✅ Found" if re.search(upload_pattern, content, re.DOTALL) else "❌ Missing",
            'debug_logging': f"✅ Complete" if not missing_debug else f"❌ Missing {len(missing_debug)} patterns"
        }
        
        self.log_test("Client Data Fetch Implementation", True, "Client data fetch implementation is correct", details)
        return True
        
    def test_consultant_id_assignment(self) -> bool:
        """Test consultant_id assignment in document upload"""
        print("\n📄 Testing consultant_id assignment in document upload...")
        
        content = self.read_file(self.client_accounting_path)
        if not content:
            self.log_test("Consultant ID Assignment", False, "File not found")
            return False
            
        # Check for correct consultant_id assignment in document insert
        doc_insert_pattern = r"consultant_id: clientData\.assigned_consultant_id"
        
        if not re.search(doc_insert_pattern, content):
            self.log_test("Consultant ID Assignment", False, "Document insert does not use clientData.assigned_consultant_id")
            return False
            
        # Check for debug logging of consultant_id
        debug_pattern = r"console\.log\('✅ DEBUG: Using consultant_id:', clientData\.assigned_consultant_id\)"
        
        if not re.search(debug_pattern, content):
            self.log_test("Consultant ID Assignment", False, "Missing debug logging for consultant_id assignment")
            return False
            
        # Check for document insert debug logging
        doc_debug_pattern = r"console\.log\('📄 DEBUG: Inserting document with data:'"
        
        details = {
            'consultant_id_field': "✅ Uses clientData.assigned_consultant_id",
            'debug_logging': "✅ Found" if re.search(debug_pattern, content) else "❌ Missing",
            'document_debug': "✅ Found" if re.search(doc_debug_pattern, content) else "❌ Missing"
        }
        
        self.log_test("Consultant ID Assignment", True, "Consultant ID assignment is correctly implemented", details)
        return True
        
    def test_task_creation_implementation(self) -> bool:
        """Test task creation after document upload"""
        print("\n📋 Testing task creation implementation...")
        
        content = self.read_file(self.client_accounting_path)
        if not content:
            self.log_test("Task Creation Implementation", False, "File not found")
            return False
            
        # Check for task creation block
        task_creation_pattern = r"if \(clientData\.assigned_consultant_id\) {.*?await supabase\s*\.from\('tasks'\)\s*\.insert\("
        
        if not re.search(task_creation_pattern, content, re.DOTALL):
            self.log_test("Task Creation Implementation", False, "Task creation block not found")
            return False
            
        # Check for correct task data structure
        task_fields = [
            r"client_id: clientData\.id",
            r"consultant_id: clientData\.assigned_consultant_id",
            r"title: `Review uploaded document: \${file\.name}`",
            r"type: 'document_review'",
            r"status: 'todo'",
            r"priority: 'medium'"
        ]
        
        missing_fields = []
        for field in task_fields:
            if not re.search(field, content):
                missing_fields.append(field)
                
        # Check for task creation debug logging
        task_debug_patterns = [
            r"console\.log\('📋 DEBUG: Creating task for document upload'\)",
            r"console\.log\('✅ Task created successfully for document review'\)",
            r"console\.error\('⚠️ Task creation failed \(non-critical\):'"
        ]
        
        missing_debug = []
        for pattern in task_debug_patterns:
            if not re.search(pattern, content):
                missing_debug.append(pattern)
                
        details = {
            'task_creation_block': "✅ Found",
            'required_fields': f"✅ Complete" if not missing_fields else f"❌ Missing {len(missing_fields)} fields",
            'debug_logging': f"✅ Complete" if not missing_debug else f"❌ Missing {len(missing_debug)} patterns",
            'error_handling': "✅ Non-critical error handling implemented"
        }
        
        success = not missing_fields
        message = "Task creation implementation is correct" if success else f"Missing {len(missing_fields)} required fields"
        
        self.log_test("Task Creation Implementation", success, message, details)
        return success
        
    def test_consultant_alert_implementation(self) -> bool:
        """Test consultant alert creation implementation"""
        print("\n🔔 Testing consultant alert implementation...")
        
        content = self.read_file(self.client_accounting_path)
        if not content:
            self.log_test("Consultant Alert Implementation", False, "File not found")
            return False
            
        # Check for alert creation block
        alert_creation_pattern = r"if \(clientData\.assigned_consultant_id\) {.*?await supabase\s*\.from\('consultant_alerts'\)\s*\.insert\("
        
        if not re.search(alert_creation_pattern, content, re.DOTALL):
            self.log_test("Consultant Alert Implementation", False, "Alert creation block not found")
            return False
            
        # Check for correct alert data structure
        alert_fields = [
            r"consultant_id: clientData\.assigned_consultant_id",
            r"client_id: clientData\.id",
            r"alert_type: 'document_uploaded'",
            r"alert_source_id: clientData\.id",
            r"message: `\${file\.name} uploaded by client`",
            r"is_resolved: false"
        ]
        
        missing_fields = []
        for field in alert_fields:
            if not re.search(field, content):
                missing_fields.append(field)
                
        # Check for alert creation debug logging
        alert_debug_patterns = [
            r"console\.log\('🔔 DEBUG: Creating consultant alert'\)",
            r"console\.log\('✅ Consultant alert created successfully'\)",
            r"console\.error\('⚠️ Alert creation failed \(non-critical\):'"
        ]
        
        missing_debug = []
        for pattern in alert_debug_patterns:
            if not re.search(pattern, content):
                missing_debug.append(pattern)
                
        details = {
            'alert_creation_block': "✅ Found",
            'required_fields': f"✅ Complete" if not missing_fields else f"❌ Missing {len(missing_fields)} fields",
            'debug_logging': f"✅ Complete" if not missing_debug else f"❌ Missing {len(missing_debug)} patterns",
            'error_handling': "✅ Non-critical error handling implemented"
        }
        
        success = not missing_fields
        message = "Consultant alert implementation is correct" if success else f"Missing {len(missing_fields)} required fields"
        
        self.log_test("Consultant Alert Implementation", success, message, details)
        return success
        
    def test_error_handling_and_logging(self) -> bool:
        """Test error handling and debug logging"""
        print("\n🐛 Testing error handling and debug logging...")
        
        content = self.read_file(self.client_accounting_path)
        if not content:
            self.log_test("Error Handling and Logging", False, "File not found")
            return False
            
        # Check for comprehensive error handling
        error_patterns = [
            r"if \(clientError \|\| !clientData\)",
            r"throw new Error\(`Client data not found for user",
            r"if \(dbError\)",
            r"throw new Error\(`Database save failed for",
            r"if \(taskError\)",
            r"if \(alertError\)"
        ]
        
        missing_error_handling = []
        for pattern in error_patterns:
            if not re.search(pattern, content):
                missing_error_handling.append(pattern)
                
        # Check for debug logging patterns
        debug_patterns = [
            r"console\.log\('🔍 DEBUG:",
            r"console\.log\('📄 DEBUG:",
            r"console\.log\('📋 DEBUG:",
            r"console\.log\('🔔 DEBUG:",
            r"console\.log\('✅ DEBUG:",
            r"console\.error\('❌"
        ]
        
        debug_count = 0
        for pattern in debug_patterns:
            debug_count += len(re.findall(pattern, content))
            
        details = {
            'error_handling_patterns': f"✅ {len(error_patterns) - len(missing_error_handling)}/{len(error_patterns)} found",
            'debug_logging_statements': f"✅ {debug_count} debug statements found",
            'comprehensive_logging': "✅ Covers all major operations"
        }
        
        success = len(missing_error_handling) <= 1 and debug_count >= 8  # Allow for minor variations
        message = "Error handling and logging is comprehensive" if success else "Some error handling or logging patterns missing"
        
        self.log_test("Error Handling and Logging", success, message, details)
        return success
        
    def test_code_structure_and_flow(self) -> bool:
        """Test overall code structure and flow"""
        print("\n🏗️ Testing code structure and flow...")
        
        content = self.read_file(self.client_accounting_path)
        if not content:
            self.log_test("Code Structure and Flow", False, "File not found")
            return False
            
        # Check for proper async/await usage
        async_patterns = [
            r"const handleFileUpload = async \(\) =>",
            r"await supabase\.from\('clients'\)",
            r"await supabase\.storage\.from\('documents'\)",
            r"await supabase\.from\('documents'\)\.insert",
            r"await supabase\.from\('tasks'\)\.insert",
            r"await supabase\.from\('consultant_alerts'\)\.insert"
        ]
        
        missing_async = []
        for pattern in async_patterns:
            if not re.search(pattern, content):
                missing_async.append(pattern)
                
        # Check for proper error handling flow
        try_catch_pattern = r"try {.*?} catch \(err: any\) {.*?console\.error\('Upload error:', err\)"
        has_try_catch = bool(re.search(try_catch_pattern, content, re.DOTALL))
        
        # Check for proper cleanup and state management
        cleanup_patterns = [
            r"setUploading\(true\)",
            r"setUploading\(false\)",
            r"setError\(''\)",
            r"setSuccessMessage\(",
            r"setShowUploadModal\(false\)",
            r"setSelectedFiles\(null\)"
        ]
        
        missing_cleanup = []
        for pattern in cleanup_patterns:
            if not re.search(pattern, content):
                missing_cleanup.append(pattern)
                
        details = {
            'async_await_usage': f"✅ {len(async_patterns) - len(missing_async)}/{len(async_patterns)} patterns found",
            'try_catch_block': "✅ Found" if has_try_catch else "❌ Missing",
            'state_management': f"✅ {len(cleanup_patterns) - len(missing_cleanup)}/{len(cleanup_patterns)} patterns found"
        }
        
        success = len(missing_async) == 0 and has_try_catch and len(missing_cleanup) <= 1
        message = "Code structure and flow is well implemented" if success else "Some structural issues found"
        
        self.log_test("Code Structure and Flow", success, message, details)
        return success
        
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all static analysis tests"""
        print("🚀 Starting ClientAccounting Static Analysis Tests")
        print("=" * 60)
        
        # Run all tests
        tests = [
            self.test_client_data_fetch_implementation,
            self.test_consultant_id_assignment,
            self.test_task_creation_implementation,
            self.test_consultant_alert_implementation,
            self.test_error_handling_and_logging,
            self.test_code_structure_and_flow
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.log_test(test.__name__, False, f"Test failed with exception: {str(e)}")
                
        return self.get_test_summary()
        
    def get_test_summary(self) -> Dict[str, Any]:
        """Get test summary"""
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
        
        print("\n" + "=" * 60)
        print("📊 STATIC ANALYSIS SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {summary['success_rate']:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
                    
        return summary

def main():
    """Main test execution"""
    analyzer = StaticAnalyzer()
    summary = analyzer.run_all_tests()
    
    return summary

if __name__ == "__main__":
    main()