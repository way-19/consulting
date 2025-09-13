#!/usr/bin/env python3
"""
Schema Check for Supabase Database
"""

import os
import requests
import json

def load_env_vars():
    """Load Supabase credentials from client app env"""
    env_path = '/app/apps/client/.env.local'
    
    supabase_url = None
    anon_key = None
    
    try:
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('VITE_SUPABASE_URL='):
                    supabase_url = line.split('=', 1)[1].strip()
                elif line.startswith('VITE_SUPABASE_ANON_KEY='):
                    anon_key = line.split('=', 1)[1].strip()
    except FileNotFoundError:
        print(f"❌ Environment file not found at {env_path}")
        
    return supabase_url, anon_key

def check_schema():
    """Check database schema"""
    supabase_url, anon_key = load_env_vars()
    
    if not supabase_url or not anon_key:
        print("❌ Missing Supabase credentials")
        return
        
    headers = {
        'apikey': anon_key,
        'Authorization': f'Bearer {anon_key}',
        'Content-Type': 'application/json'
    }
    
    # Check available tables
    print("🔍 Checking available tables...")
    
    tables_to_check = ['clients', 'documents', 'tasks', 'consultant_alerts', 'user_profiles']
    
    for table in tables_to_check:
        url = f"{supabase_url}/rest/v1/{table}"
        try:
            response = requests.get(url, headers=headers, params={'limit': '1'})
            print(f"Table '{table}': Status {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    print(f"  Sample columns: {list(data[0].keys())}")
                else:
                    print("  No data found")
            else:
                error_data = response.json() if response.content else {}
                print(f"  Error: {error_data}")
                
        except Exception as e:
            print(f"  Exception: {str(e)}")
            
        print()

if __name__ == "__main__":
    check_schema()