"""
test_supabase.py
This module contains tests for Supabase functionality.
"""
import json

def test_models(client):
    """
    Test Supabase model creation.

    Args:
        client: Flask test client fixture

    Tests:
        1. Model creation returns 200
        2. Response indicates successful creation

    Raises:
        AssertionError: If response code isn't 200 or creation fails
    """
    response = client.post('/create_model')
    assert response.status_code == 200
    status = response.get_json().get('status')
    assert status == 'model created successfully'
    print("\n==========================================")
    print("✅ TEST PASSED: Supabase Models")
    print("==========================================")

def test_migrations(client):
    """
    Test Supabase migration application.

    Args:
        client: Flask test client fixture

    Tests:
        1. Migration endpoint returns 200
        2. Response indicates successful migration

    Raises:
        AssertionError: If response code isn't 200 or migration fails
    """
    response = client.post('/apply_migration', json={'section': 'test_section'})
    assert response.status_code == 200
    status = response.get_json().get('status')
    assert status == 'migration applied successfully'
    print("\n==========================================")
    print("✅ TEST PASSED: Supabase Migrations")
    print("==========================================")

def test_auth(client):
    """
    Test Supabase authentication functionalities.

    Args:
        client: Flask test client fixture

    Tests:
        1. User sign-up endpoint returns 200
        2. User sign-in endpoint returns 200
        3. Password reset endpoint returns 200

    Raises:
        AssertionError: If response code isn't 200 or auth fails
    """
    # Test sign-up
    response = client.post('/signup', json={'email': 'test@example.com', 'password': 'TestPassword123'})
    assert response.status_code == 200
    # Test sign-in
    response = client.post('/signin', json={'email': 'test@example.com', 'password': 'TestPassword123'})
    assert response.status_code == 200
    # Test password reset
    response = client.post('/reset_password', json={'email': 'test@example.com'})
    assert response.status_code == 200

    print("\n==========================================")
    print("✅ TEST PASSED: Supabase Auth")
    print("==========================================")

def test_api(client):
    """
    Test Supabase CRUD operations via API endpoints.

    Args:
        client: Flask test client fixture

    Tests:
        1. Record creation endpoint returns 200
        2. Record reading endpoint returns 200
        3. Record update endpoint returns 200
        4. Record deletion endpoint returns 200

    Raises:
        AssertionError: If response code isn't 200 or CRUD operation fails
    """
    table_name = "test_table"    
    # Test record creation
    response = client.post('/create_record', json={'table': table_name, 'data': {'name': 'Test'}})
    assert response.status_code == 200
    record_id = response.get_json().get('id')
    assert record_id is not None
    # Test reading records
    response = client.get('/read_records', json={'table': table_name})
    assert response.status_code == 200
    # Test updating a record
    response = client.put('/update_record', json={'table': table_name, 'record_id': record_id, 'data': {'name': 'Updated Test'}})
    assert response.status_code == 200
    # Test deleting a record
    response = client.delete('/delete_record', json={'table': table_name, 'record_id': record_id})
    assert response.status_code == 200

    print("\n==========================================")
    print("✅ TEST PASSED: Supabase API")
    print("==========================================")
