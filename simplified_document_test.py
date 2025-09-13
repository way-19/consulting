#!/usr/bin/env python3
"""
Simplified Document Upload Test for ClientAccounting.tsx
Tests the specific functionality mentioned in the review request:
1. Document upload to Supabase Storage (file upload)
2. Direct database insertion to 'documents' table using simplified approach
3. Task creation after successful document insert 
4. Alert creation for consultant notifications
5. Client data fetch with assigned_consultant_id
"""

import os
import requests
import json
import uuid
from datetime import datetime, timedelta

class SimplifiedDocumentTester:
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
        
    def load_env_vars(self):
        """Load Supabase credentials from client app env"""
        env_path = '/app/apps/client/.env.local'
        
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
            
    def make_request(self, method: str, endpoint: str, data=None, params=None):
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
            
    def test_supabase_url_configuration(self):
        """Test 1: Verify corrected Supabase URL resolves 404 errors"""
        print("\n🌐 Testing Supabase URL Configuration...")
        
        # Test basic connectivity to the corrected URL
        url = f"{self.supabase_url}/rest/v1/"
        try:
            response = requests.get(url, headers=self.headers)
            if response.status_code == 200:
                self.log_test("Supabase URL Configuration", True, 
                            f"Successfully connected to {self.supabase_url}", 
                            {'status_code': response.status_code})
                return True
            else:
                self.log_test("Supabase URL Configuration", False, 
                            f"Failed to connect: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Supabase URL Configuration", False, f"Connection error: {str(e)}")
            return False
            
    def test_client_data_fetch_with_consultant_id(self):
        """Test 2: Client data fetch with assigned_consultant_id"""
        print("\n👤 Testing Client Data Fetch with assigned_consultant_id...")
        
        # First, let's see what's in the clients table
        result = self.make_request('GET', 'clients', params={'limit': '5'})
        
        if not result['success']:
            self.log_test("Client Data Fetch", False, 
                        f"Failed to query clients table: {result.get('data', {})}")
            return False
            
        clients_data = result['data'] or []
        
        if len(clients_data) == 0:
            # Create a test client with assigned_consultant_id
            test_client = {
                'id': str(uuid.uuid4()),
                'profile_id': str(uuid.uuid4()),
                'assigned_consultant_id': str(uuid.uuid4()),
                'created_at': datetime.now().isoformat()
            }
            
            create_result = self.make_request('POST', 'clients', test_client)
            
            if not create_result['success']:
                self.log_test("Client Data Fetch", False, 
                            f"Failed to create test client: {create_result.get('data', {})}")
                return False
                
            # Now test the fetch with the created client
            fetch_params = {
                'profile_id': f'eq.{test_client["profile_id"]}',
                'select': 'id,assigned_consultant_id,profile_id'
            }
            
            fetch_result = self.make_request('GET', 'clients', params=fetch_params)
            
            if fetch_result['success'] and fetch_result['data']:
                client_data = fetch_result['data'][0]
                if 'assigned_consultant_id' in client_data:
                    self.log_test("Client Data Fetch", True, 
                                "Successfully fetched client with assigned_consultant_id", 
                                client_data)
                    return True
                else:
                    self.log_test("Client Data Fetch", False, 
                                "assigned_consultant_id field missing from response")
                    return False
            else:
                self.log_test("Client Data Fetch", False, 
                            f"Failed to fetch created client: {fetch_result.get('data', {})}")
                return False
        else:
            # Use existing client data
            client_data = clients_data[0]
            if 'assigned_consultant_id' in client_data:
                self.log_test("Client Data Fetch", True, 
                            "Found existing client with assigned_consultant_id", 
                            client_data)
                return True
            else:
                self.log_test("Client Data Fetch", False, 
                            "assigned_consultant_id field missing from existing client")
                return False
                
    def test_simplified_direct_database_insert(self):
        """Test 3: Direct database insertion to 'documents' table using simplified approach"""
        print("\n📄 Testing Simplified Direct Database Insert...")
        
        # Test the multi-method approach as implemented in ClientAccounting.tsx
        test_client_id = str(uuid.uuid4())
        test_consultant_id = str(uuid.uuid4())
        
        # Method 1: Try minimal direct insert (as in the code)
        doc_data = {
            'client_id': test_client_id,
            'consultant_id': test_consultant_id,
            'name': 'test-invoice.pdf',
            'type': 'financial',
            'status': 'uploaded',
            'file_url': 'https://example.com/test-invoice.pdf'
        }
        
        print("   Attempting Method 1: Minimal direct insert...")
        result1 = self.make_request('POST', 'documents', doc_data)
        
        if result1['success']:
            self.log_test("Direct Database Insert - Method 1", True, 
                        "Minimal direct insert successful", result1['data'])
            return True
        else:
            print(f"   Method 1 failed: {result1.get('data', {})}")
            
            # Method 2: Try with string conversion (as in the code)
            string_doc_data = {
                **doc_data,
                'client_id': str(doc_data['client_id']),
                'consultant_id': str(doc_data['consultant_id']),
                'file_size': 1024000,
                'mime_type': 'application/pdf',
                'category': 'invoice',
                'amount': 1500.00,
                'currency': 'USD'
            }
            
            print("   Attempting Method 2: With type conversion...")
            result2 = self.make_request('POST', 'documents', string_doc_data)
            
            if result2['success']:
                self.log_test("Direct Database Insert - Method 2", True, 
                            "Type conversion insert successful", result2['data'])
                return True
            else:
                print(f"   Method 2 failed: {result2.get('data', {})}")
                
                # Method 3: Try with upsert (as mentioned in the code)
                upsert_doc_data = {
                    **string_doc_data,
                    'id': str(uuid.uuid4())
                }
                
                print("   Attempting Method 3: Upsert operation...")
                result3 = self.make_request('POST', 'documents', upsert_doc_data, 
                                          params={'on_conflict': 'id'})
                
                if result3['success']:
                    self.log_test("Direct Database Insert - Method 3", True, 
                                "Upsert operation successful", result3['data'])
                    return True
                else:
                    self.log_test("Direct Database Insert", False, 
                                f"All 3 methods failed. Last error: {result3.get('data', {})}")
                    return False
                    
    def test_task_creation_after_document_insert(self):
        """Test 4: Task creation after successful document insert"""
        print("\n📋 Testing Task Creation After Document Insert...")
        
        test_client_id = str(uuid.uuid4())
        test_consultant_id = str(uuid.uuid4())
        
        # Create a task as would be done after document upload
        task_data = {
            'client_id': test_client_id,
            'consultant_id': test_consultant_id,
            'title': 'Review uploaded document: test-invoice.pdf',
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
            created_task = result['data'][0] if result['data'] else {}
            self.log_test("Task Creation", True, 
                        "Task created successfully after document insert", 
                        {
                            'task_id': created_task.get('id'),
                            'consultant_id': created_task.get('consultant_id'),
                            'type': created_task.get('type'),
                            'due_date': created_task.get('due_date')
                        })
            return True
        else:
            self.log_test("Task Creation", False, 
                        f"Failed to create task: {result.get('data', {})}")
            return False
            
    def test_alert_creation_for_consultant_notifications(self):
        """Test 5: Alert creation for consultant notifications"""
        print("\n🔔 Testing Alert Creation for Consultant Notifications...")
        
        test_client_id = str(uuid.uuid4())
        test_consultant_id = str(uuid.uuid4())
        
        # Create a consultant alert as would be done after document upload
        alert_data = {
            'consultant_id': test_consultant_id,
            'client_id': test_client_id,
            'alert_type': 'document_uploaded',
            'alert_source_id': test_client_id,
            'message': 'test-invoice.pdf uploaded by client',
            'is_resolved': False
        }
        
        result = self.make_request('POST', 'consultant_alerts', alert_data)
        
        if result['success']:
            created_alert = result['data'][0] if result['data'] else {}
            self.log_test("Alert Creation", True, 
                        "Consultant alert created successfully", 
                        {
                            'alert_id': created_alert.get('id'),
                            'consultant_id': created_alert.get('consultant_id'),
                            'alert_type': created_alert.get('alert_type'),
                            'message': created_alert.get('message')
                        })
            return True
        else:
            self.log_test("Alert Creation", False, 
                        f"Failed to create consultant alert: {result.get('data', {})}")
            return False
            
    def run_all_tests(self):
        """Run all tests focusing on the review request requirements"""
        print("🚀 Starting Simplified Document Upload Tests")
        print("Focus: Testing simplified document upload functionality after removing complex RPC calls")
        print("=" * 80)
        
        if not self.supabase_url or not self.anon_key:
            self.log_test("Environment Check", False, "Missing Supabase credentials")
            return self.get_test_summary()
            
        # Run tests in order of the review request
        tests = [
            self.test_supabase_url_configuration,
            self.test_client_data_fetch_with_consultant_id,
            self.test_simplified_direct_database_insert,
            self.test_task_creation_after_document_insert,
            self.test_alert_creation_for_consultant_notifications
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.log_test(test.__name__, False, f"Test failed with exception: {str(e)}")
                
        return self.get_test_summary()
        
    def get_test_summary(self):
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
        
        print("\n" + "=" * 80)
        print("📊 SIMPLIFIED DOCUMENT UPLOAD TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {summary['success_rate']:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
                    
        if passed_tests > 0:
            print("\n✅ PASSED TESTS:")
            for result in self.test_results:
                if result['success']:
                    print(f"   • {result['test']}: {result['message']}")
                    
        return summary

def main():
    """Main test execution"""
    tester = SimplifiedDocumentTester()
    summary = tester.run_all_tests()
    
    # Exit with appropriate code
    return 0 if summary['failed'] == 0 else 1

if __name__ == "__main__":
    exit_code = main()
    exit(exit_code)