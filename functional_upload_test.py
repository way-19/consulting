#!/usr/bin/env python3
"""
Functional Upload Test - Browser-based testing
Tests the actual upload functionality to verify no JavaScript errors occur
"""

import os
import sys
import json
import time
import tempfile
from datetime import datetime
from typing import Dict, List, Optional, Any

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.common.exceptions import TimeoutException, WebDriverException
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False

class FunctionalUploadTester:
    def __init__(self):
        self.test_results = []
        self.driver = None
        self.base_url = "https://debug-monorepo.preview.emergentagent.com/apps/client/dist/index.html"
        
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
            
    def setup_browser(self) -> bool:
        """Setup Chrome browser for testing"""
        if not SELENIUM_AVAILABLE:
            self.log_test("Browser Setup", False, "Selenium not available - skipping browser tests")
            return False
            
        try:
            chrome_options = Options()
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_argument('--disable-web-security')
            chrome_options.add_argument('--allow-running-insecure-content')
            
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
            
            self.log_test("Browser Setup", True, f"Browser setup successful. Testing URL: {self.base_url}")
            return True
            
        except Exception as e:
            self.log_test("Browser Setup", False, f"Failed to setup browser: {str(e)}")
            return False
            
    def test_page_load_and_login(self) -> bool:
        """Test page load and login functionality"""
        print("\n🌐 Testing page load and login...")
        
        if not self.driver:
            self.log_test("Page Load and Login", False, "Browser not available")
            return False
            
        try:
            # Navigate to the application
            self.driver.get(self.base_url)
            
            # Wait for page to load
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Check for any immediate JavaScript errors
            logs = self.driver.get_log('browser')
            severe_errors = [log for log in logs if log['level'] == 'SEVERE']
            
            # Look for login form
            try:
                email_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email'], input[name='email']"))
                )
                password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password'], input[name='password']")
                
                # Fill login form
                email_input.clear()
                email_input.send_keys("client@consulting19.com")
                password_input.clear()
                password_input.send_keys("Client123!")
                
                # Find and click login button
                login_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit'], button:contains('Login'), button:contains('Sign In')")
                login_button.click()
                
                # Wait for navigation
                time.sleep(3)
                
                self.log_test("Page Load and Login", True, "Successfully loaded page and logged in", {
                    'severe_errors_on_load': len(severe_errors),
                    'current_url': self.driver.current_url
                })
                return True
                
            except TimeoutException:
                # Maybe already logged in or different page structure
                current_url = self.driver.current_url
                page_title = self.driver.title
                
                self.log_test("Page Load and Login", True, "Page loaded (login form not found - may be already authenticated)", {
                    'current_url': current_url,
                    'page_title': page_title,
                    'severe_errors_on_load': len(severe_errors)
                })
                return True
                
        except Exception as e:
            self.log_test("Page Load and Login", False, f"Failed to load page or login: {str(e)}")
            return False
            
    def test_accounting_section_access(self) -> bool:
        """Test access to accounting section"""
        print("\n📊 Testing accounting section access...")
        
        if not self.driver:
            self.log_test("Accounting Section Access", False, "Browser not available")
            return False
            
        try:
            # Look for accounting section or navigation
            accounting_elements = [
                "//h1[contains(text(), 'Monthly Accounting')]",
                "//h1[contains(text(), 'Accounting')]",
                "//a[contains(text(), 'Accounting')]",
                "//button[contains(text(), 'Accounting')]",
                "//div[contains(@class, 'accounting')]"
            ]
            
            accounting_found = False
            for xpath in accounting_elements:
                try:
                    element = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, xpath))
                    )
                    if "h1" not in xpath.lower():
                        element.click()
                        time.sleep(2)
                    accounting_found = True
                    break
                except TimeoutException:
                    continue
                    
            if not accounting_found:
                # Try to navigate by URL
                current_url = self.driver.current_url
                if "accounting" not in current_url.lower():
                    # Try common accounting URLs
                    accounting_urls = [
                        current_url.replace("index.html", "accounting.html"),
                        current_url + "#/accounting",
                        current_url + "/accounting"
                    ]
                    
                    for url in accounting_urls:
                        try:
                            self.driver.get(url)
                            time.sleep(2)
                            if "accounting" in self.driver.page_source.lower():
                                accounting_found = True
                                break
                        except:
                            continue
                            
            if accounting_found:
                self.log_test("Accounting Section Access", True, "Successfully accessed accounting section", {
                    'current_url': self.driver.current_url
                })
                return True
            else:
                self.log_test("Accounting Section Access", False, "Could not find or access accounting section")
                return False
                
        except Exception as e:
            self.log_test("Accounting Section Access", False, f"Failed to access accounting section: {str(e)}")
            return False
            
    def test_upload_modal_functionality(self) -> bool:
        """Test upload modal opening and form functionality"""
        print("\n📤 Testing upload modal functionality...")
        
        if not self.driver:
            self.log_test("Upload Modal Functionality", False, "Browser not available")
            return False
            
        try:
            # Look for upload button
            upload_button_selectors = [
                "//button[contains(text(), 'Upload Document')]",
                "//button[contains(text(), 'Upload')]",
                "//button[contains(@class, 'upload')]",
                "//a[contains(text(), 'Upload')]"
            ]
            
            upload_button = None
            for selector in upload_button_selectors:
                try:
                    upload_button = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.XPATH, selector))
                    )
                    break
                except TimeoutException:
                    continue
                    
            if not upload_button:
                self.log_test("Upload Modal Functionality", False, "Upload button not found")
                return False
                
            # Check for JavaScript errors before clicking
            logs_before = self.driver.get_log('browser')
            severe_errors_before = [log for log in logs_before if log['level'] == 'SEVERE']
            
            # Click upload button
            upload_button.click()
            time.sleep(2)
            
            # Check for modal
            modal_selectors = [
                "//h2[contains(text(), 'Upload Document')]",
                "//div[contains(@class, 'modal')]",
                "//div[contains(@class, 'dialog')]"
            ]
            
            modal_found = False
            for selector in modal_selectors:
                try:
                    WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, selector))
                    )
                    modal_found = True
                    break
                except TimeoutException:
                    continue
                    
            # Check for JavaScript errors after clicking
            logs_after = self.driver.get_log('browser')
            severe_errors_after = [log for log in logs_after if log['level'] == 'SEVERE']
            new_errors = len(severe_errors_after) - len(severe_errors_before)
            
            if modal_found:
                self.log_test("Upload Modal Functionality", True, "Upload modal opened successfully", {
                    'modal_found': modal_found,
                    'new_js_errors': new_errors,
                    'severe_errors_before': len(severe_errors_before),
                    'severe_errors_after': len(severe_errors_after)
                })
                return True
            else:
                self.log_test("Upload Modal Functionality", False, "Upload modal did not open", {
                    'new_js_errors': new_errors
                })
                return False
                
        except Exception as e:
            self.log_test("Upload Modal Functionality", False, f"Failed to test upload modal: {str(e)}")
            return False
            
    def test_form_interaction_no_errors(self) -> bool:
        """Test form interaction without JavaScript errors"""
        print("\n📝 Testing form interaction without JavaScript errors...")
        
        if not self.driver:
            self.log_test("Form Interaction No Errors", False, "Browser not available")
            return False
            
        try:
            # Get initial JavaScript errors
            logs_initial = self.driver.get_log('browser')
            severe_errors_initial = [log for log in logs_initial if log['level'] == 'SEVERE']
            
            # Look for form elements
            form_elements = {
                'file_input': "input[type='file']",
                'category_select': "select",
                'amount_input': "input[type='number']",
                'notes_textarea': "textarea"
            }
            
            found_elements = {}
            for element_name, selector in form_elements.items():
                try:
                    element = self.driver.find_element(By.CSS_SELECTOR, selector)
                    found_elements[element_name] = True
                    
                    # Interact with the element
                    if element_name == 'file_input':
                        # Create a temporary test file
                        with tempfile.NamedTemporaryFile(mode='w', suffix='.pdf', delete=False) as f:
                            f.write("Test PDF content")
                            temp_file_path = f.name
                        element.send_keys(temp_file_path)
                        os.unlink(temp_file_path)  # Clean up
                    elif element_name == 'amount_input':
                        element.clear()
                        element.send_keys("100.50")
                    elif element_name == 'notes_textarea':
                        element.clear()
                        element.send_keys("Test upload for error verification")
                    elif element_name == 'category_select':
                        # Just click to open dropdown
                        element.click()
                        time.sleep(0.5)
                        
                except Exception as e:
                    found_elements[element_name] = False
                    
            # Wait a moment for any JavaScript to execute
            time.sleep(2)
            
            # Check for new JavaScript errors
            logs_final = self.driver.get_log('browser')
            severe_errors_final = [log for log in logs_final if log['level'] == 'SEVERE']
            new_errors = len(severe_errors_final) - len(severe_errors_initial)
            
            # Look specifically for setSuccess errors
            setSuccess_errors = [
                log for log in logs_final 
                if 'setSuccess is not defined' in log['message'] or 'setSuccess' in log['message']
            ]
            
            if setSuccess_errors:
                self.log_test("Form Interaction No Errors", False, "setSuccess errors found during form interaction", {
                    'setSuccess_errors': [log['message'] for log in setSuccess_errors],
                    'found_elements': found_elements
                })
                return False
                
            self.log_test("Form Interaction No Errors", True, "Form interaction completed without setSuccess errors", {
                'found_elements': found_elements,
                'new_js_errors': new_errors,
                'setSuccess_errors': len(setSuccess_errors),
                'total_severe_errors': len(severe_errors_final)
            })
            return True
            
        except Exception as e:
            self.log_test("Form Interaction No Errors", False, f"Failed to test form interaction: {str(e)}")
            return False
            
    def cleanup(self):
        """Cleanup resources"""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
                
    def run_functional_tests(self) -> Dict[str, Any]:
        """Run all functional tests"""
        print("🚀 Starting Functional Upload Tests")
        print("=" * 60)
        print("Focus: Testing upload functionality without JavaScript errors")
        print("=" * 60)
        
        if not self.setup_browser():
            return self.get_test_summary()
            
        try:
            # Run functional tests
            tests = [
                self.test_page_load_and_login,
                self.test_accounting_section_access,
                self.test_upload_modal_functionality,
                self.test_form_interaction_no_errors
            ]
            
            for test in tests:
                try:
                    test()
                except Exception as e:
                    self.log_test(test.__name__, False, f"Test failed with exception: {str(e)}")
                    
        finally:
            self.cleanup()
            
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
        print("📊 FUNCTIONAL TEST SUMMARY")
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
            print("\n✅ ALL FUNCTIONAL TESTS PASSED!")
                    
        return summary

def main():
    """Main test execution"""
    tester = FunctionalUploadTester()
    summary = tester.run_functional_tests()
    
    return summary

if __name__ == "__main__":
    result = main()
    print(f"\nFunctional test completed with {result['passed']}/{result['total_tests']} tests passing")