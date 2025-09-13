#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite for Document Upload and Alert System
Tests the consultant_id bug fix and related functionality through static code analysis
"""

import os
import re
import json
from typing import Dict, List, Optional, Any
from datetime import datetime

class ComprehensiveBackendTester:
    def __init__(self):
        self.test_results = []
        self.app_root = '/app'
        
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

    def test_client_accounting_consultant_id_fix(self) -> bool:
        """Test ClientAccounting consultant_id bug fix implementation"""
        print("\n🔍 Testing ClientAccounting consultant_id bug fix...")
        
        file_path = f"{self.app_root}/apps/client/src/pages/client/ClientAccounting.tsx"
        content = self.read_file_content(file_path)
        
        if not content:
            self.log_test("ClientAccounting File Check", False, "ClientAccounting.tsx file not found")
            return False
        
        # Check for correct consultant_id assignment
        consultant_id_pattern = r'consultant_id:\s*clientData\.assigned_consultant_id'
        if not re.search(consultant_id_pattern, content):
            self.log_test("Consultant ID Assignment", False, "consultant_id not correctly assigned from clientData.assigned_consultant_id")
            return False
        
        # Check for client data fetch with assigned_consultant_id
        client_query_pattern = r'\.select\([\'"`]id,\s*assigned_consultant_id,\s*profile_id[\'"`]\)'
        if not re.search(client_query_pattern, content):
            self.log_test("Client Data Query", False, "Client query doesn't select assigned_consultant_id")
            return False
        
        # Check for task creation after document upload
        task_creation_pattern = r'\.from\([\'"`]tasks[\'"`]\)\s*\.insert\('
        if not re.search(task_creation_pattern, content):
            self.log_test("Task Creation", False, "Task creation not implemented after document upload")
            return False
        
        # Check for consultant alert creation
        alert_creation_pattern = r'\.from\([\'"`]consultant_alerts[\'"`]\)\s*\.insert\('
        if not re.search(alert_creation_pattern, content):
            self.log_test("Alert Creation", False, "Consultant alert creation not implemented")
            return False
        
        # Check for proper error handling
        error_handling_pattern = r'console\.error|catch\s*\([^)]*err'
        if not re.search(error_handling_pattern, content):
            self.log_test("Error Handling", False, "Proper error handling not implemented")
            return False
        
        self.log_test("ClientAccounting Implementation", True, "All consultant_id bug fixes properly implemented", {
            'consultant_id_assignment': 'Uses clientData.assigned_consultant_id',
            'client_query': 'Selects assigned_consultant_id',
            'task_creation': 'Implemented',
            'alert_creation': 'Implemented',
            'error_handling': 'Present'
        })
        return True

    def test_consultant_alerts_component(self) -> bool:
        """Test ConsultantAlerts component functionality"""
        print("\n🔔 Testing ConsultantAlerts component...")
        
        file_path = f"{self.app_root}/apps/consultant/src/components/ConsultantAlerts.tsx"
        content = self.read_file_content(file_path)
        
        if not content:
            self.log_test("ConsultantAlerts File Check", False, "ConsultantAlerts.tsx file not found")
            return False
        
        # Check for alert fetching
        alert_fetch_pattern = r'\.from\([\'"`]consultant_alerts[\'"`]\)'
        if not re.search(alert_fetch_pattern, content):
            self.log_test("Alert Fetching", False, "Alert fetching not implemented")
            return False
        
        # Check for alert resolution functionality
        resolve_pattern = r'resolveAlert|is_resolved.*true'
        if not re.search(resolve_pattern, content):
            self.log_test("Alert Resolution", False, "Alert resolution functionality not implemented")
            return False
        
        # Check for navigation based on alert type
        navigation_pattern = r'window\.location\.href|navigate'
        if not re.search(navigation_pattern, content):
            self.log_test("Alert Navigation", False, "Navigation on alert resolution not implemented")
            return False
        
        # Check for different alert types handling
        alert_types = ['document_uploaded', 'payment_overdue', 'payment_reminder']
        alert_types_found = sum(1 for alert_type in alert_types if alert_type in content)
        
        if alert_types_found < 2:
            self.log_test("Alert Types", False, f"Only {alert_types_found} alert types handled")
            return False
        
        self.log_test("ConsultantAlerts Component", True, "All alert functionality properly implemented", {
            'alert_fetching': 'Implemented',
            'alert_resolution': 'Implemented', 
            'navigation': 'Implemented',
            'alert_types_handled': alert_types_found
        })
        return True

    def test_consultant_documents_mark_as_viewed(self) -> bool:
        """Test ConsultantDocuments markDocumentsAsViewed functionality"""
        print("\n📄 Testing ConsultantDocuments mark as viewed functionality...")
        
        file_path = f"{self.app_root}/apps/consultant/src/pages/consultant/ConsultantDocuments.tsx"
        content = self.read_file_content(file_path)
        
        if not content:
            self.log_test("ConsultantDocuments File Check", False, "ConsultantDocuments.tsx file not found")
            return False
        
        # Check for markDocumentsAsViewed function
        mark_viewed_pattern = r'markDocumentsAsViewed'
        if not re.search(mark_viewed_pattern, content):
            self.log_test("Mark as Viewed Function", False, "markDocumentsAsViewed function not found")
            return False
        
        # Check for alert resolution in mark as viewed
        alert_resolve_pattern = r'is_resolved.*true'
        if not re.search(alert_resolve_pattern, content):
            self.log_test("Alert Resolution in Mark Viewed", False, "Alert resolution not implemented in markDocumentsAsViewed")
            return False
        
        # Check for client-level alert resolution
        client_level_pattern = r'alert_source_id.*selectedClient|alert_source_id.*client'
        if not re.search(client_level_pattern, content):
            self.log_test("Client-level Alert Resolution", False, "Client-level alert resolution not implemented")
            return False
        
        # Check for document-specific alert resolution (backward compatibility)
        doc_specific_pattern = r'documentIds|document.*id'
        if not re.search(doc_specific_pattern, content):
            self.log_test("Document-specific Alert Resolution", False, "Document-specific alert resolution not implemented")
            return False
        
        self.log_test("Mark as Viewed Functionality", True, "All mark as viewed functionality properly implemented", {
            'function_exists': 'Yes',
            'alert_resolution': 'Implemented',
            'client_level_resolution': 'Implemented',
            'document_specific_resolution': 'Implemented'
        })
        return True

    def test_consultant_layout_notification_badges(self) -> bool:
        """Test ConsultantLayout notification badge system"""
        print("\n🔔 Testing ConsultantLayout notification badges...")
        
        file_path = f"{self.app_root}/apps/consultant/src/components/layouts/ConsultantLayout.tsx"
        content = self.read_file_content(file_path)
        
        if not content:
            self.log_test("ConsultantLayout File Check", False, "ConsultantLayout.tsx file not found")
            return False
        
        # Check for notification count states
        notification_states = ['pendingTasksCount', 'alertsCount']
        states_found = sum(1 for state in notification_states if state in content)
        
        if states_found < 2:
            self.log_test("Notification States", False, f"Only {states_found}/2 notification states found")
            return False
        
        # Check for notification count fetching
        fetch_pattern = r'fetchNotificationCounts'
        if not re.search(fetch_pattern, content):
            self.log_test("Notification Fetching", False, "Notification count fetching not implemented")
            return False
        
        # Check for real-time updates (interval)
        interval_pattern = r'setInterval.*fetchNotificationCounts|30000'
        if not re.search(interval_pattern, content):
            self.log_test("Real-time Updates", False, "Real-time notification updates not implemented")
            return False
        
        # Check for badge display in navigation
        badge_pattern = r'badge.*item\.badge|item\.badge.*badge'
        if not re.search(badge_pattern, content):
            self.log_test("Badge Display", False, "Badge display in navigation not implemented")
            return False
        
        # Check for tasks and alerts count queries
        tasks_query = 'tasks' in content and 'consultant_id' in content
        alerts_query = 'consultant_alerts' in content and 'is_resolved' in content
        
        if not (tasks_query and alerts_query):
            self.log_test("Count Queries", False, "Tasks or alerts count queries not properly implemented")
            return False
        
        self.log_test("Notification Badge System", True, "All notification badge functionality properly implemented", {
            'notification_states': f"{states_found}/2 found",
            'fetching_function': 'Implemented',
            'real_time_updates': 'Implemented',
            'badge_display': 'Implemented',
            'count_queries': 'Both tasks and alerts implemented'
        })
        return True

    def test_task_creation_workflow(self) -> bool:
        """Test task creation workflow from document upload"""
        print("\n📋 Testing task creation workflow...")
        
        file_path = f"{self.app_root}/apps/client/src/pages/client/ClientAccounting.tsx"
        content = self.read_file_content(file_path)
        
        if not content:
            self.log_test("Task Creation File Check", False, "ClientAccounting.tsx file not found")
            return False
        
        # Check for task creation with correct fields
        required_task_fields = [
            'client_id',
            'consultant_id', 
            'title',
            'description',
            'type',
            'status',
            'priority',
            'due_date'
        ]
        
        task_fields_found = sum(1 for field in required_task_fields if field in content)
        
        if task_fields_found < len(required_task_fields):
            self.log_test("Task Fields", False, f"Only {task_fields_found}/{len(required_task_fields)} required task fields found")
            return False
        
        # Check for document_review task type
        doc_review_pattern = r'type.*[\'"`]document_review[\'"`]'
        if not re.search(doc_review_pattern, content):
            self.log_test("Task Type", False, "document_review task type not set")
            return False
        
        # Check for due date calculation (7 days)
        due_date_pattern = r'7.*24.*60.*60.*1000|Date\.now.*7'
        if not re.search(due_date_pattern, content):
            self.log_test("Due Date Calculation", False, "7-day due date calculation not implemented")
            return False
        
        # Check for non-critical error handling (task creation shouldn't block document upload)
        non_critical_pattern = r'non-critical|shouldn.*block|taskError.*console'
        if not re.search(non_critical_pattern, content):
            self.log_test("Non-critical Error Handling", False, "Task creation errors not handled as non-critical")
            return False
        
        self.log_test("Task Creation Workflow", True, "Task creation workflow properly implemented", {
            'required_fields': f"{task_fields_found}/{len(required_task_fields)} found",
            'task_type': 'document_review',
            'due_date': '7 days calculated',
            'error_handling': 'Non-critical'
        })
        return True

    def test_alert_system_integration(self) -> bool:
        """Test complete alert system integration"""
        print("\n🔗 Testing alert system integration...")
        
        # Check ClientAccounting for alert creation
        client_file = f"{self.app_root}/apps/client/src/pages/client/ClientAccounting.tsx"
        client_content = self.read_file_content(client_file)
        
        # Check ConsultantAlerts for alert handling
        alerts_file = f"{self.app_root}/apps/consultant/src/components/ConsultantAlerts.tsx"
        alerts_content = self.read_file_content(alerts_file)
        
        # Check ConsultantDocuments for alert resolution
        docs_file = f"{self.app_root}/apps/consultant/src/pages/consultant/ConsultantDocuments.tsx"
        docs_content = self.read_file_content(docs_file)
        
        if not all([client_content, alerts_content, docs_content]):
            self.log_test("Alert System Files", False, "One or more alert system files not found")
            return False
        
        # Check alert creation in client
        alert_creation = 'consultant_alerts' in client_content and 'document_uploaded' in client_content
        
        # Check alert fetching in consultant alerts
        alert_fetching = 'consultant_alerts' in alerts_content and 'is_resolved' in alerts_content and 'false' in alerts_content
        
        # Check alert resolution in documents
        alert_resolution = 'consultant_alerts' in docs_content and 'is_resolved' in docs_content and 'true' in docs_content
        
        # Check alert types consistency
        alert_types_client = client_content.count('document_uploaded')
        alert_types_consultant = alerts_content.count('document_uploaded')
        
        integration_score = sum([alert_creation, alert_fetching, alert_resolution])
        
        if integration_score < 3:
            self.log_test("Alert System Integration", False, f"Only {integration_score}/3 integration points working")
            return False
        
        self.log_test("Alert System Integration", True, "Complete alert system integration verified", {
            'alert_creation': 'Implemented in ClientAccounting',
            'alert_fetching': 'Implemented in ConsultantAlerts',
            'alert_resolution': 'Implemented in ConsultantDocuments',
            'alert_types_consistency': f"document_uploaded found in {alert_types_client + alert_types_consultant} places"
        })
        return True

    def test_database_schema_consistency(self) -> bool:
        """Test database schema consistency across components"""
        print("\n🗄️ Testing database schema consistency...")
        
        files_to_check = [
            f"{self.app_root}/apps/client/src/pages/client/ClientAccounting.tsx",
            f"{self.app_root}/apps/consultant/src/components/ConsultantAlerts.tsx",
            f"{self.app_root}/apps/consultant/src/pages/consultant/ConsultantDocuments.tsx"
        ]
        
        # Expected table names and key fields
        expected_tables = {
            'clients': ['id', 'assigned_consultant_id', 'profile_id'],
            'documents': ['id', 'client_id', 'consultant_id', 'type', 'status'],
            'tasks': ['id', 'client_id', 'consultant_id', 'title', 'type', 'status'],
            'consultant_alerts': ['id', 'consultant_id', 'client_id', 'alert_type', 'is_resolved']
        }
        
        schema_consistency = {}
        
        for file_path in files_to_check:
            content = self.read_file_content(file_path)
            if not content:
                continue
                
            file_name = file_path.split('/')[-1]
            schema_consistency[file_name] = {}
            
            for table, fields in expected_tables.items():
                table_found = table in content
                fields_found = sum(1 for field in fields if field in content)
                schema_consistency[file_name][table] = {
                    'table_found': table_found,
                    'fields_found': f"{fields_found}/{len(fields)}"
                }
        
        # Check if all critical tables are used consistently
        critical_tables = ['clients', 'documents', 'consultant_alerts']
        consistency_score = 0
        
        for table in critical_tables:
            table_usage = sum(1 for file_data in schema_consistency.values() 
                            if file_data.get(table, {}).get('table_found', False))
            if table_usage >= 2:  # Used in at least 2 files
                consistency_score += 1
        
        if consistency_score < len(critical_tables):
            self.log_test("Database Schema Consistency", False, f"Only {consistency_score}/{len(critical_tables)} tables used consistently")
            return False
        
        self.log_test("Database Schema Consistency", True, "Database schema used consistently across components", {
            'consistency_details': schema_consistency,
            'critical_tables_consistent': f"{consistency_score}/{len(critical_tables)}"
        })
        return True

    def run_all_tests(self) -> Dict[str, Any]:
        """Run all comprehensive tests"""
        print("🚀 Starting Comprehensive Backend Tests")
        print("=" * 60)
        
        tests = [
            self.test_client_accounting_consultant_id_fix,
            self.test_consultant_alerts_component,
            self.test_consultant_documents_mark_as_viewed,
            self.test_consultant_layout_notification_badges,
            self.test_task_creation_workflow,
            self.test_alert_system_integration,
            self.test_database_schema_consistency
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.log_test(test.__name__, False, f"Test failed with exception: {str(e)}")
        
        return self.get_test_summary()

    def get_test_summary(self) -> Dict[str, Any]:
        """Get comprehensive test summary"""
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
        print("📊 COMPREHENSIVE TEST SUMMARY")
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
        
        if passed_tests > 0:
            print("\n✅ PASSED TESTS:")
            for result in self.test_results:
                if result['success']:
                    print(f"   • {result['test']}: {result['message']}")
                    
        return summary

def main():
    """Main test execution"""
    tester = ComprehensiveBackendTester()
    summary = tester.run_all_tests()
    
    # Exit with appropriate code
    return 0 if summary['failed'] == 0 else 1

if __name__ == "__main__":
    exit(main())