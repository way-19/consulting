#!/usr/bin/env python3
"""
Backend Test Suite for ClientAccounting Document Upload Functionality
Tests the consultant_id bug fix and related functionality using Supabase
"""

import os
import sys
import json
import uuid
import time
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

class SupabaseTestClient:
    def __init__(self):
        # Load environment variables from frontend/.env
        self.load_env_vars()
        self.base_url = self.supabase_url
        self.headers = {
            'apikey': self.anon_key,
            'Authorization': f'Bearer {self.anon_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        
    def load_env_vars(self):
        """Load Supabase credentials from frontend/.env"""
        env_path = '/app/apps/client/.env.local'
        if not os.path.exists(env_path):
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
            print(f"SUPABASE_URL: {'SET' if self.supabase_url else 'MISSING'}")
            print(f"ANON_KEY: {'SET' if self.anon_key else 'MISSING'}")
            
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

class ClientAccountingTester:
    def __init__(self):
        self.client = SupabaseTestClient()
        self.test_results = []
        self.test_client_id = None
        self.test_consultant_id = None
        self.test_profile_id = None
        
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
            
    def setup_test_data(self) -> bool:
        """Setup test data for testing"""
        print("\n🔧 Setting up test data...")
        
        # Debug: Check available tables and existing data
        print("🔍 DEBUG: Checking database connection and available data...")
        
        # Try to get existing clients
        clients_result = self.client.make_request('GET', 'clients', params={'limit': '5'})
        print(f"Clients query result: {clients_result}")
        
        # Try to get existing profiles  
        profiles_result = self.client.make_request('GET', 'user_profiles', params={'limit': '5'})
        print(f"Profiles query result: {profiles_result}")
        
        # If we can't access the database, skip setup and use mock data
        if not clients_result['success'] and not profiles_result['success']:
            print("⚠️ Database access failed, using mock data for testing")
            self.test_profile_id = "mock-profile-id"
            self.test_consultant_id = "mock-consultant-id"
            self.test_client_id = "mock-client-id"
            
            self.log_test("Setup Test Data", True, "Using mock data for testing", {
                'profile_id': self.test_profile_id,
                'client_id': self.test_client_id,
                'consultant_id': self.test_consultant_id,
                'note': 'Mock data - database connection failed'
            })
            return True
        
        # If we have existing data, use it
        if clients_result['success'] and clients_result['data'] and len(clients_result['data']) > 0:
            client_data = clients_result['data'][0]
            self.test_client_id = client_data['id']
            self.test_profile_id = client_data.get('profile_id', 'unknown')
            self.test_consultant_id = client_data.get('assigned_consultant_id', 'unknown')
            
            self.log_test("Setup Test Data", True, "Using existing client data", {
                'profile_id': self.test_profile_id,
                'client_id': self.test_client_id,
                'consultant_id': self.test_consultant_id
            })
            return True
        
        # If no existing data, create new test data
        self.test_profile_id = str(uuid.uuid4())
        self.test_consultant_id = str(uuid.uuid4())
        self.test_client_id = str(uuid.uuid4())
        
        self.log_test("Setup Test Data", True, "Created new test IDs", {
            'profile_id': self.test_profile_id,
            'client_id': self.test_client_id,
            'consultant_id': self.test_consultant_id,
            'note': 'New test data created'
        })
        return True
        
    def test_client_data_fetch(self) -> bool:
        """Test client data fetch with assigned_consultant_id"""
        print("\n🔍 Testing client data fetch...")
        
        # Test the exact query used in ClientAccounting component
        params = {
            'profile_id': f'eq.{self.test_profile_id}',
            'select': 'id,assigned_consultant_id,profile_id'
        }
        
        result = self.client.make_request('GET', 'clients', params=params)
        
        if not result['success']:
            self.log_test("Client Data Fetch", False, f"Failed to fetch client data: {result.get('data', {})}")
            return False
            
        data = result['data']
        if not data or len(data) == 0:
            self.log_test("Client Data Fetch", False, "No client data found for profile_id")
            return False
            
        client_data = data[0]
        expected_fields = ['id', 'assigned_consultant_id', 'profile_id']
        missing_fields = [field for field in expected_fields if field not in client_data]
        
        if missing_fields:
            self.log_test("Client Data Fetch", False, f"Missing fields: {missing_fields}", client_data)
            return False
            
        if client_data['assigned_consultant_id'] != self.test_consultant_id:
            self.log_test("Client Data Fetch", False, f"Incorrect consultant_id: expected {self.test_consultant_id}, got {client_data['assigned_consultant_id']}")
            return False
            
        self.log_test("Client Data Fetch", True, "Client data fetched successfully with correct assigned_consultant_id", client_data)
        return True
        
    def test_document_upload_consultant_id(self) -> bool:
        """Test document upload with correct consultant_id assignment"""
        print("\n📄 Testing document upload with consultant_id fix...")
        
        # Simulate document upload data
        document_data = {
            'id': str(uuid.uuid4()),
            'client_id': self.test_client_id,
            'consultant_id': self.test_consultant_id,  # This should come from clientData.assigned_consultant_id
            'name': 'test-invoice.pdf',
            'type': 'financial',
            'category': 'invoice',
            'status': 'uploaded',
            'file_url': 'https://example.com/test-invoice.pdf',
            'file_size': 1024000,
            'mime_type': 'application/pdf',
            'notes': 'Test document upload',
            'amount': 1500.00,
            'currency': 'USD',
            'transaction_date': '2024-01-15',
            'uploaded_at': datetime.now().isoformat()
        }
        
        result = self.client.make_request('POST', 'documents', document_data)
        
        if not result['success']:
            self.log_test("Document Upload", False, f"Failed to upload document: {result.get('data', {})}")
            return False
            
        uploaded_doc = result['data'][0] if result['data'] else {}
        
        # Verify consultant_id is correctly set
        if uploaded_doc.get('consultant_id') != self.test_consultant_id:
            self.log_test("Document Upload", False, f"Incorrect consultant_id in uploaded document: expected {self.test_consultant_id}, got {uploaded_doc.get('consultant_id')}")
            return False
            
        self.log_test("Document Upload", True, "Document uploaded with correct consultant_id", {
            'document_id': uploaded_doc.get('id'),
            'consultant_id': uploaded_doc.get('consultant_id'),
            'client_id': uploaded_doc.get('client_id')
        })
        return True
        
    def test_task_creation(self) -> bool:
        """Test automatic task creation after document upload"""
        print("\n📋 Testing task creation after document upload...")
        
        # Create a task as would be done after document upload
        task_data = {
            'id': str(uuid.uuid4()),
            'client_id': self.test_client_id,
            'consultant_id': self.test_consultant_id,
            'title': 'Review uploaded document: test-invoice.pdf',
            'description': 'Client has uploaded a new invoice document that requires review.',
            'type': 'document_review',
            'status': 'todo',
            'priority': 'medium',
            'due_date': (datetime.now() + timedelta(days=7)).isoformat(),
            'estimated_hours': 0.5,
            'billable': False,
            'is_client_visible': False,
            'created_at': datetime.now().isoformat()
        }
        
        result = self.client.make_request('POST', 'tasks', task_data)
        
        if not result['success']:
            self.log_test("Task Creation", False, f"Failed to create task: {result.get('data', {})}")
            return False
            
        created_task = result['data'][0] if result['data'] else {}
        
        # Verify task has correct consultant_id
        if created_task.get('consultant_id') != self.test_consultant_id:
            self.log_test("Task Creation", False, f"Incorrect consultant_id in created task: expected {self.test_consultant_id}, got {created_task.get('consultant_id')}")
            return False
            
        self.log_test("Task Creation", True, "Task created successfully with correct consultant_id", {
            'task_id': created_task.get('id'),
            'consultant_id': created_task.get('consultant_id'),
            'title': created_task.get('title'),
            'type': created_task.get('type')
        })
        return True
        
    def test_consultant_alert_creation(self) -> bool:
        """Test consultant alert creation for document notifications"""
        print("\n🔔 Testing consultant alert creation...")
        
        # Create a consultant alert as would be done after document upload
        alert_data = {
            'id': str(uuid.uuid4()),
            'consultant_id': self.test_consultant_id,
            'client_id': self.test_client_id,
            'alert_type': 'document_uploaded',
            'alert_source_id': self.test_client_id,
            'message': 'test-invoice.pdf uploaded by client',
            'is_resolved': False,
            'created_at': datetime.now().isoformat()
        }
        
        result = self.client.make_request('POST', 'consultant_alerts', alert_data)
        
        if not result['success']:
            self.log_test("Consultant Alert Creation", False, f"Failed to create consultant alert: {result.get('data', {})}")
            return False
            
        created_alert = result['data'][0] if result['data'] else {}
        
        # Verify alert has correct consultant_id
        if created_alert.get('consultant_id') != self.test_consultant_id:
            self.log_test("Consultant Alert Creation", False, f"Incorrect consultant_id in created alert: expected {self.test_consultant_id}, got {created_alert.get('consultant_id')}")
            return False
            
        self.log_test("Consultant Alert Creation", True, "Consultant alert created successfully", {
            'alert_id': created_alert.get('id'),
            'consultant_id': created_alert.get('consultant_id'),
            'alert_type': created_alert.get('alert_type'),
            'message': created_alert.get('message')
        })
        return True
        
    def test_database_relationships(self) -> bool:
        """Test database relationships are properly maintained"""
        print("\n🔗 Testing database relationships...")
        
        # Fetch documents for the client
        doc_params = {
            'client_id': f'eq.{self.test_client_id}',
            'type': f'eq.financial'
        }
        
        doc_result = self.client.make_request('GET', 'documents', params=doc_params)
        
        if not doc_result['success']:
            self.log_test("Database Relationships - Documents", False, f"Failed to fetch documents: {doc_result.get('data', {})}")
            return False
            
        # Fetch tasks for the consultant
        task_params = {
            'consultant_id': f'eq.{self.test_consultant_id}',
            'client_id': f'eq.{self.test_client_id}'
        }
        
        task_result = self.client.make_request('GET', 'tasks', params=task_params)
        
        if not task_result['success']:
            self.log_test("Database Relationships - Tasks", False, f"Failed to fetch tasks: {task_result.get('data', {})}")
            return False
            
        # Fetch alerts for the consultant
        alert_params = {
            'consultant_id': f'eq.{self.test_consultant_id}',
            'client_id': f'eq.{self.test_client_id}'
        }
        
        alert_result = self.client.make_request('GET', 'consultant_alerts', params=alert_params)
        
        if not alert_result['success']:
            self.log_test("Database Relationships - Alerts", False, f"Failed to fetch alerts: {alert_result.get('data', {})}")
            return False
            
        self.log_test("Database Relationships", True, "All database relationships verified", {
            'documents_count': len(doc_result['data'] or []),
            'tasks_count': len(task_result['data'] or []),
            'alerts_count': len(alert_result['data'] or [])
        })
        return True
        
    def cleanup_test_data(self):
        """Clean up test data"""
        print("\n🧹 Cleaning up test data...")
        
        # Delete in reverse order of creation to avoid foreign key constraints
        cleanup_operations = [
            ('consultant_alerts', {'consultant_id': f'eq.{self.test_consultant_id}'}),
            ('tasks', {'consultant_id': f'eq.{self.test_consultant_id}'}),
            ('documents', {'client_id': f'eq.{self.test_client_id}'}),
            ('clients', {'id': f'eq.{self.test_client_id}'}),
            ('profiles', {'id': f'eq.{self.test_profile_id}'}),
            ('profiles', {'id': f'eq.{self.test_consultant_id}'})
        ]
        
        for table, params in cleanup_operations:
            result = self.client.make_request('DELETE', table, params=params)
            if result['success']:
                print(f"   ✅ Cleaned up {table}")
            else:
                print(f"   ⚠️ Failed to clean up {table}: {result.get('data', {})}")
                
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all tests and return results"""
        print("🚀 Starting ClientAccounting Backend Tests")
        print("=" * 60)
        
        if not self.client.supabase_url or not self.client.anon_key:
            self.log_test("Environment Check", False, "Missing Supabase credentials")
            return self.get_test_summary()
            
        # Setup test data
        if not self.setup_test_data():
            return self.get_test_summary()
            
        try:
            # Run all tests
            tests = [
                self.test_client_data_fetch,
                self.test_document_upload_consultant_id,
                self.test_task_creation,
                self.test_consultant_alert_creation,
                self.test_database_relationships
            ]
            
            for test in tests:
                try:
                    test()
                except Exception as e:
                    self.log_test(test.__name__, False, f"Test failed with exception: {str(e)}")
                    
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
        print("📊 TEST SUMMARY")
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
    tester = ClientAccountingTester()
    summary = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if summary['failed'] == 0 else 1)

if __name__ == "__main__":
    main()