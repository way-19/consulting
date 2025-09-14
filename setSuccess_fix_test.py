#!/usr/bin/env python3
"""
setSuccess Fix Test - Code Analysis
Tests specifically for the "setSuccess is not defined" ReferenceError fix
"""

import os
import re
import json
from datetime import datetime
from typing import Dict, List, Optional, Any

class SetSuccessFixTester:
    def __init__(self):
        self.test_results = []
        self.client_accounting_path = "/app/apps/client/src/pages/client/ClientAccounting.tsx"
        
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
            
    def test_setSuccess_variable_fix(self) -> bool:
        """Test that setSuccess has been changed to setSuccessMessage"""
        print("\n🔍 Testing setSuccess variable fix...")
        
        try:
            with open(self.client_accounting_path, 'r') as f:
                content = f.read()
                
            # Look for any remaining setSuccess references
            setSuccess_pattern = r'\bsetSuccess\b'
            setSuccess_matches = re.findall(setSuccess_pattern, content)
            
            # Look for setSuccessMessage references
            setSuccessMessage_pattern = r'\bsetSuccessMessage\b'
            setSuccessMessage_matches = re.findall(setSuccessMessage_pattern, content)
            
            # Check line 281 specifically (mentioned in the review request)
            lines = content.split('\n')
            line_281 = lines[280] if len(lines) > 280 else ""  # 0-indexed
            
            # Look for the specific context around line 281
            context_lines = []
            for i in range(max(0, 275), min(len(lines), 285)):
                context_lines.append(f"Line {i+1}: {lines[i]}")
                
            if setSuccess_matches:
                self.log_test("setSuccess Variable Fix", False, f"Found {len(setSuccess_matches)} remaining setSuccess references", {
                    'setSuccess_count': len(setSuccess_matches),
                    'setSuccessMessage_count': len(setSuccessMessage_matches),
                    'line_281': line_281,
                    'context_around_281': context_lines
                })
                return False
                
            if len(setSuccessMessage_matches) == 0:
                self.log_test("setSuccess Variable Fix", False, "No setSuccessMessage references found", {
                    'setSuccess_count': len(setSuccess_matches),
                    'setSuccessMessage_count': len(setSuccessMessage_matches)
                })
                return False
                
            self.log_test("setSuccess Variable Fix", True, f"setSuccess properly changed to setSuccessMessage", {
                'setSuccess_count': len(setSuccess_matches),
                'setSuccessMessage_count': len(setSuccessMessage_matches),
                'line_281': line_281
            })
            return True
            
        except Exception as e:
            self.log_test("setSuccess Variable Fix", False, f"Failed to analyze file: {str(e)}")
            return False
            
    def test_success_message_state_declaration(self) -> bool:
        """Test that successMessage state is properly declared"""
        print("\n📝 Testing successMessage state declaration...")
        
        try:
            with open(self.client_accounting_path, 'r') as f:
                content = f.read()
                
            # Look for useState declaration for successMessage
            useState_pattern = r'const\s*\[\s*successMessage\s*,\s*setSuccessMessage\s*\]\s*=\s*useState'
            useState_match = re.search(useState_pattern, content)
            
            if not useState_match:
                self.log_test("successMessage State Declaration", False, "successMessage useState declaration not found")
                return False
                
            # Get the line number of the declaration
            lines_before_match = content[:useState_match.start()].count('\n')
            line_number = lines_before_match + 1
            
            self.log_test("successMessage State Declaration", True, f"successMessage useState properly declared at line {line_number}", {
                'declaration': useState_match.group(0),
                'line_number': line_number
            })
            return True
            
        except Exception as e:
            self.log_test("successMessage State Declaration", False, f"Failed to analyze state declaration: {str(e)}")
            return False
            
    def test_localStorage_fallback_implementation(self) -> bool:
        """Test localStorage fallback implementation"""
        print("\n💾 Testing localStorage fallback implementation...")
        
        try:
            with open(self.client_accounting_path, 'r') as f:
                content = f.read()
                
            # Look for localStorage fallback code
            localStorage_patterns = [
                r'localStorage\.getItem\([\'"]pending_documents[\'"]',
                r'localStorage\.setItem\([\'"]pending_documents[\'"]',
                r'duplicate key.*constraint',
                r'pending_admin_fix',
                r'Document saved temporarily'
            ]
            
            found_patterns = {}
            for pattern in localStorage_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                found_patterns[pattern] = len(matches)
                
            missing_patterns = [pattern for pattern, count in found_patterns.items() if count == 0]
            
            if missing_patterns:
                self.log_test("localStorage Fallback Implementation", False, f"Missing localStorage fallback patterns: {len(missing_patterns)}", {
                    'found_patterns': found_patterns,
                    'missing_patterns': missing_patterns
                })
                return False
                
            # Look for the specific fallback structure
            fallback_structure_pattern = r'if\s*\(\s*err\.message.*duplicate key.*constraint.*\)\s*\{'
            fallback_match = re.search(fallback_structure_pattern, content, re.IGNORECASE | re.DOTALL)
            
            if not fallback_match:
                self.log_test("localStorage Fallback Implementation", False, "localStorage fallback structure not found")
                return False
                
            self.log_test("localStorage Fallback Implementation", True, "localStorage fallback properly implemented", {
                'found_patterns': found_patterns,
                'fallback_structure_found': bool(fallback_match)
            })
            return True
            
        except Exception as e:
            self.log_test("localStorage Fallback Implementation", False, f"Failed to analyze localStorage fallback: {str(e)}")
            return False
            
    def test_upload_function_structure(self) -> bool:
        """Test upload function structure and error handling"""
        print("\n⚡ Testing upload function structure...")
        
        try:
            with open(self.client_accounting_path, 'r') as f:
                content = f.read()
                
            # Look for handleFileUpload function
            function_pattern = r'const\s+handleFileUpload\s*=\s*async\s*\(\s*\)\s*=>\s*\{'
            function_match = re.search(function_pattern, content)
            
            if not function_match:
                self.log_test("Upload Function Structure", False, "handleFileUpload function not found")
                return False
                
            # Look for key components within the function
            key_components = [
                r'setUploading\(true\)',
                r'setError\([\'"][\'"]?\)',
                r'validateFile\(',
                r'supabase\.storage',
                r'\.from\([\'"]documents[\'"]',
                r'\.upload\(',
                r'setSuccessMessage\(',
                r'catch\s*\(\s*err',
                r'finally\s*\{'
            ]
            
            found_components = {}
            for component in key_components:
                matches = re.findall(component, content)
                found_components[component] = len(matches)
                
            missing_components = [comp for comp, count in found_components.items() if count == 0]
            
            if missing_components:
                self.log_test("Upload Function Structure", False, f"Missing function components: {len(missing_components)}", {
                    'found_components': found_components,
                    'missing_components': missing_components
                })
                return False
                
            self.log_test("Upload Function Structure", True, "Upload function structure is complete", {
                'found_components': found_components
            })
            return True
            
        except Exception as e:
            self.log_test("Upload Function Structure", False, f"Failed to analyze function structure: {str(e)}")
            return False
            
    def test_amount_validation_fix(self) -> bool:
        """Test amount validation to prevent NaN values"""
        print("\n🔢 Testing amount validation fix...")
        
        try:
            with open(self.client_accounting_path, 'r') as f:
                content = f.read()
                
            # Look for amount validation logic
            validation_patterns = [
                r'parseFloat\(.*\.trim\(\)\)',
                r'!isNaN\(',
                r'isFinite\(',
                r'validatedAmount\s*=\s*parsedAmount',
                r'validatedAmount\s*=\s*null'
            ]
            
            found_validations = {}
            for pattern in validation_patterns:
                matches = re.findall(pattern, content)
                found_validations[pattern] = len(matches)
                
            missing_validations = [pattern for pattern, count in found_validations.items() if count == 0]
            
            if missing_validations:
                self.log_test("Amount Validation Fix", False, f"Missing validation patterns: {len(missing_validations)}", {
                    'found_validations': found_validations,
                    'missing_validations': missing_validations
                })
                return False
                
            # Look for the specific validation structure
            validation_block_pattern = r'let\s+validatedAmount\s*=\s*null.*?if\s*\(.*?parseFloat.*?isNaN.*?isFinite'
            validation_match = re.search(validation_block_pattern, content, re.DOTALL)
            
            if not validation_match:
                self.log_test("Amount Validation Fix", False, "Complete validation block not found")
                return False
                
            self.log_test("Amount Validation Fix", True, "Amount validation properly implemented", {
                'found_validations': found_validations,
                'validation_block_found': bool(validation_match)
            })
            return True
            
        except Exception as e:
            self.log_test("Amount Validation Fix", False, f"Failed to analyze amount validation: {str(e)}")
            return False
            
    def run_setSuccess_fix_tests(self) -> Dict[str, Any]:
        """Run all setSuccess fix tests"""
        print("🚀 Starting setSuccess Fix Tests for ClientAccounting.tsx")
        print("=" * 60)
        print("Focus: Verifying the setSuccess → setSuccessMessage fix")
        print("=" * 60)
        
        # Check if file exists
        if not os.path.exists(self.client_accounting_path):
            self.log_test("File Existence", False, f"ClientAccounting.tsx not found at {self.client_accounting_path}")
            return self.get_test_summary()
            
        try:
            # Run specific tests for the setSuccess fix
            tests = [
                self.test_setSuccess_variable_fix,
                self.test_success_message_state_declaration,
                self.test_localStorage_fallback_implementation,
                self.test_upload_function_structure,
                self.test_amount_validation_fix
            ]
            
            for test in tests:
                try:
                    test()
                except Exception as e:
                    self.log_test(test.__name__, False, f"Test failed with exception: {str(e)}")
                    
        except Exception as e:
            self.log_test("Test Execution", False, f"Failed to run tests: {str(e)}")
            
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
        print("📊 setSuccess FIX TEST SUMMARY")
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
        else:
            print("\n✅ ALL setSuccess FIX TESTS PASSED!")
            print("The setSuccess ReferenceError has been successfully fixed!")
                    
        return summary

def main():
    """Main test execution"""
    tester = SetSuccessFixTester()
    summary = tester.run_setSuccess_fix_tests()
    
    # Exit with appropriate code
    return summary

if __name__ == "__main__":
    result = main()
    print(f"\nTest completed with {result['passed']}/{result['total_tests']} tests passing")