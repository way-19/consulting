#!/usr/bin/env python3
"""
Multi-Method Database Insert Test for ClientAccounting Upload Functionality
Tests the new 3-method approach to bypass log_privacy_action trigger error
"""

import os
import sys
import json
import uuid
import time
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

class MultiMethodUploadTester:
    def __init__(self):
        self.load_env_vars()
        self.base_url = self.supabase_url
        self.headers = {
            'apikey': self.anon_key,
            'Authorization': f'Bearer {self.anon_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        self.test_results = []
        self.test_client_id = None
        self.test_consultant_id = None
        self.test_profile_id = None
        
    def load_env_vars(self):
        """Load Supabase credentials from frontend/.env"""
        env_path = '/app/frontend/.env'
        self.supabase_url = None
        self.anon_key = None
        
        try:
            with open(env_path, 'r') as f:
                for line in f:
                    if line.startswith('VITE_SUPABASE_URL='):
                        self.supabase_url = line.split('=', 1)[1].strip()
                    elif line.startswith('VITE_SUPABASE_ANON_KEY='):
                        self.anon_key = line.split('=', 1)[1].strip()
        except FileNotFoundError:
            print(f"❌ Environment file not found at {env_path}")
            
        if not self.supabase_url or not self.anon_key:
            print("❌ Missing Supabase credentials in environment file")
            
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
            
    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, params: Optional[Dict] = None) -> Dict:
        """Make HTTP request to Supabase REST API"""
        url = f"{self.base_url}/rest/v1/{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=self.headers, params=params)
            elif method.upper() == 'POST':
                response = requests.post(url, headers=self.headers, json=data, params=params)
            elif method.upper() == 'PATCH':
                response = requests.patch(url, headers=self.headers, json=data, params=params)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=self.headers, params=params)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            return {
                'status_code': response.status_code,
                'data': response.json() if response.content else None,
                'success': 200 <= response.status_code < 300
            }
        except requests.exceptions.RequestException as e:
            return {
                'status_code': 0,
                'data': None,
                'success': False,
                'error': str(e)
            }

    def setup_test_data(self) -> bool:
        """Setup test data for testing"""
        print("\n🔧 Setting up test data for multi-method upload testing...")
        
        # Try to get existing clients first
        clients_result = self.make_request('GET', 'clients', params={'limit': '1'})
        
        if clients_result['success'] and clients_result['data'] and len(clients_result['data']) > 0:
            client_data = clients_result['data'][0]
            self.test_client_id = client_data['id']
            self.test_profile_id = client_data.get('profile_id', str(uuid.uuid4()))
            self.test_consultant_id = client_data.get('assigned_consultant_id', str(uuid.uuid4()))
            
            self.log_test("Setup Test Data", True, "Using existing client data", {
                'profile_id': self.test_profile_id,
                'client_id': self.test_client_id,
                'consultant_id': self.test_consultant_id
            })
            return True
        
        # Create new test data if no existing data
        self.test_profile_id = str(uuid.uuid4())
        self.test_consultant_id = str(uuid.uuid4())
        self.test_client_id = str(uuid.uuid4())
        
        self.log_test("Setup Test Data", True, "Created new test IDs", {
            'profile_id': self.test_profile_id,
            'client_id': self.test_client_id,
            'consultant_id': self.test_consultant_id
        })
        return True

    def test_method_1_minimal_fields(self) -> bool:
        """Test Method 1: Minimal required fields only"""
        print("\n📄 Testing Method 1: Minimal Fields Insert...")
        
        document_data = {
            'client_id': self.test_client_id,
            'consultant_id': self.test_consultant_id,
            'name': 'test-method1-invoice.pdf',
            'type': 'financial',
            'status': 'uploaded',
            'file_url': 'https://example.com/test-method1-invoice.pdf'
        }
        
        result = self.make_request('POST', 'documents', document_data)
        
        if result['success']:
            self.log_test("Method 1 - Minimal Fields", True, "Document inserted successfully with minimal fields", {
                'method': 'minimal_fields',
                'document_id': result['data'][0]['id'] if result['data'] else 'unknown',
                'status_code': result['status_code']
            })
            return True
        else:
            error_msg = result.get('data', {}).get('message', 'Unknown error') if result.get('data') else result.get('error', 'Unknown error')
            self.log_test("Method 1 - Minimal Fields", False, f"Failed to insert with minimal fields: {error_msg}", {
                'method': 'minimal_fields',
                'status_code': result['status_code'],
                'error_details': result.get('data', {})
            })
            return False

    def test_method_2_type_casting(self) -> bool:
        """Test Method 2: Type casting with String() and Number()"""
        print("\n📄 Testing Method 2: Type Casting Insert...")
        
        document_data = {
            'client_id': self.test_client_id,
            'consultant_id': self.test_consultant_id,
            'name': 'test-method2-invoice.pdf',
            'type': 'financial',
            'category': 'invoice',
            'status': 'uploaded',
            'file_url': 'https://example.com/test-method2-invoice.pdf',
            'file_size': 1024000,
            'mime_type': 'application/pdf',
            'notes': 'Test document with type casting',
            'currency': 'USD'
        }
        
        result = self.make_request('POST', 'documents', document_data)
        
        if result['success']:
            self.log_test("Method 2 - Type Casting", True, "Document inserted successfully with type casting", {
                'method': 'type_casting',
                'document_id': result['data'][0]['id'] if result['data'] else 'unknown',
                'status_code': result['status_code']
            })
            return True
        else:
            error_msg = result.get('data', {}).get('message', 'Unknown error') if result.get('data') else result.get('error', 'Unknown error')
            self.log_test("Method 2 - Type Casting", False, f"Failed to insert with type casting: {error_msg}", {
                'method': 'type_casting',
                'status_code': result['status_code'],
                'error_details': result.get('data', {})
            })
            return False

    def test_method_3_upsert(self) -> bool:
        """Test Method 3: Upsert instead of insert"""
        print("\n📄 Testing Method 3: Upsert Insert...")
        
        document_id = str(uuid.uuid4())
        document_data = {
            'id': document_id,
            'client_id': self.test_client_id,
            'consultant_id': self.test_consultant_id,
            'name': 'test-method3-invoice.pdf',
            'type': 'financial',
            'status': 'uploaded',
            'file_url': 'https://example.com/test-method3-invoice.pdf'
        }
        
        # Use upsert endpoint
        result = self.make_request('POST', 'documents', document_data, params={'on_conflict': 'id'})
        
        if result['success']:
            self.log_test("Method 3 - Upsert", True, "Document inserted successfully with upsert", {
                'method': 'upsert',
                'document_id': document_id,
                'status_code': result['status_code']
            })
            return True
        else:
            error_msg = result.get('data', {}).get('message', 'Unknown error') if result.get('data') else result.get('error', 'Unknown error')
            self.log_test("Method 3 - Upsert", False, f"Failed to insert with upsert: {error_msg}", {
                'method': 'upsert',
                'status_code': result['status_code'],
                'error_details': result.get('data', {})
            })
            return False

    def test_task_creation_after_document_insert(self) -> bool:
        """Test task creation after successful document insert"""
        print("\n📋 Testing task creation after document insert...")
        
        task_data = {
            'client_id': self.test_client_id,
            'consultant_id': self.test_consultant_id,
            'title': 'Review uploaded document: test-task-creation.pdf',
            'description': 'Client has uploaded a new invoice document that requires review.',
            'type': 'document_review',
            'status': 'todo',
            'priority': 'medium',
            'due_date': (datetime.now() + timedelta(days=7)).isoformat(),
            'estimated_hours': 0.5,
            'billable': False,
            'is_client_visible': False
        }
        
        result = self.make_request('POST', 'tasks', task_data)
        
        if result['success']:
            self.log_test("Task Creation", True, "Task created successfully after document insert", {
                'task_id': result['data'][0]['id'] if result['data'] else 'unknown',
                'consultant_id': result['data'][0]['consultant_id'] if result['data'] else 'unknown',
                'task_type': result['data'][0]['type'] if result['data'] else 'unknown'
            })
            return True
        else:
            error_msg = result.get('data', {}).get('message', 'Unknown error') if result.get('data') else result.get('error', 'Unknown error')
            self.log_test("Task Creation", False, f"Failed to create task: {error_msg}", {
                'status_code': result['status_code'],
                'error_details': result.get('data', {})
            })
            return False

    def test_consultant_alert_creation(self) -> bool:
        """Test consultant alert creation after document insert"""
        print("\n🔔 Testing consultant alert creation...")
        
        alert_data = {
            'consultant_id': self.test_consultant_id,
            'client_id': self.test_client_id,
            'alert_type': 'document_uploaded',
            'alert_source_id': self.test_client_id,
            'message': 'test-alert-creation.pdf uploaded by client',
            'is_resolved': False
        }
        
        result = self.make_request('POST', 'consultant_alerts', alert_data)
        
        if result['success']:
            self.log_test("Consultant Alert Creation", True, "Alert created successfully after document insert", {
                'alert_id': result['data'][0]['id'] if result['data'] else 'unknown',
                'consultant_id': result['data'][0]['consultant_id'] if result['data'] else 'unknown',
                'alert_type': result['data'][0]['alert_type'] if result['data'] else 'unknown'
            })
            return True
        else:
            error_msg = result.get('data', {}).get('message', 'Unknown error') if result.get('data') else result.get('error', 'Unknown error')
            self.log_test("Consultant Alert Creation", False, f"Failed to create alert: {error_msg}", {
                'status_code': result['status_code'],
                'error_details': result.get('data', {})
            })
            return False

    def test_end_to_end_upload_process(self) -> bool:
        """Test the complete end-to-end upload process"""
        print("\n🔄 Testing end-to-end upload process...")
        
        # Simulate the complete process as implemented in ClientAccounting
        methods_tested = []
        document_inserted = False
        
        # Method 1: Minimal fields
        print("   Trying Method 1: Minimal fields...")
        method1_result = self.test_method_1_minimal_fields()
        methods_tested.append(('minimal_fields', method1_result))
        if method1_result:
            document_inserted = True
        
        # Method 2: Type casting (only if Method 1 failed)
        if not document_inserted:
            print("   Trying Method 2: Type casting...")
            method2_result = self.test_method_2_type_casting()
            methods_tested.append(('type_casting', method2_result))
            if method2_result:
                document_inserted = True
        
        # Method 3: Upsert (only if Methods 1 & 2 failed)
        if not document_inserted:
            print("   Trying Method 3: Upsert...")
            method3_result = self.test_method_3_upsert()
            methods_tested.append(('upsert', method3_result))
            if method3_result:
                document_inserted = True
        
        # Test task and alert creation only if document was inserted
        task_created = False
        alert_created = False
        
        if document_inserted:
            print("   Document inserted successfully, testing task creation...")
            task_created = self.test_task_creation_after_document_insert()
            
            print("   Testing alert creation...")
            alert_created = self.test_consultant_alert_creation()
        
        success = document_inserted and task_created and alert_created
        
        self.log_test("End-to-End Upload Process", success, 
                     f"Upload process {'completed successfully' if success else 'failed'}", {
            'document_inserted': document_inserted,
            'methods_tested': methods_tested,
            'task_created': task_created,
            'alert_created': alert_created,
            'working_method': next((method for method, result in methods_tested if result), None)
        })
        
        return success

    def cleanup_test_data(self):
        """Clean up test data"""
        print("\n🧹 Cleaning up test data...")
        
        cleanup_operations = [
            ('consultant_alerts', {'consultant_id': f'eq.{self.test_consultant_id}'}),
            ('tasks', {'consultant_id': f'eq.{self.test_consultant_id}'}),
            ('documents', {'client_id': f'eq.{self.test_client_id}', 'name': 'like.test-method*'})
        ]
        
        for table, params in cleanup_operations:
            result = self.make_request('DELETE', table, params=params)
            if result['success']:
                print(f"   ✅ Cleaned up {table}")
            else:
                print(f"   ⚠️ Failed to clean up {table}: {result.get('data', {})}")

    def run_all_tests(self) -> Dict[str, Any]:
        """Run all multi-method upload tests"""
        print("🚀 Starting Multi-Method Database Insert Tests")
        print("=" * 60)
        
        if not self.supabase_url or not self.anon_key:
            self.log_test("Environment Check", False, "Missing Supabase credentials")
            return self.get_test_summary()
        
        # Setup test data
        if not self.setup_test_data():
            return self.get_test_summary()
        
        try:
            # Test individual methods
            print("\n🔍 Testing individual insert methods...")
            method1_success = self.test_method_1_minimal_fields()
            method2_success = self.test_method_2_type_casting()
            method3_success = self.test_method_3_upsert()
            
            # Test complete workflow
            print("\n🔄 Testing complete upload workflow...")
            workflow_success = self.test_end_to_end_upload_process()
            
            # Summary of which methods work
            working_methods = []
            if method1_success:
                working_methods.append("Method 1 (Minimal Fields)")
            if method2_success:
                working_methods.append("Method 2 (Type Casting)")
            if method3_success:
                working_methods.append("Method 3 (Upsert)")
            
            print(f"\n📊 WORKING METHODS: {', '.join(working_methods) if working_methods else 'None'}")
            
        finally:
            # Always cleanup
            self.cleanup_test_data()
        
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
        print("📊 MULTI-METHOD UPLOAD TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {summary['success_rate']:.1f}%")
        
        # Show which methods worked
        working_methods = []
        for result in self.test_results:
            if result['success'] and 'method' in result.get('details', {}):
                method = result['details']['method']
                if method not in working_methods:
                    working_methods.append(method)
        
        if working_methods:
            print(f"\n✅ WORKING METHODS:")
            for method in working_methods:
                print(f"   • {method}")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        return summary

def main():
    """Main test execution"""
    tester = MultiMethodUploadTester()
    summary = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if summary['failed'] == 0 else 1)

if __name__ == "__main__":
    main()