"""
test_supabase.py

This module contains tests for Supabase functionality.
"""

def test_models():
    """
    Tests the database models for correctness.

    Returns:
        None
    """
    from app.supabase.models import BaseModel
    model_instance = BaseModel()
    assert model_instance is not None
    print("test_models PASSED")

def test_migrations():
    """
    Tests the apply_migration function for proper execution.

    Returns:
        None
    """
    from app.supabase.migrations import apply_migration
    try:
        apply_migration("test_section")
        print("test_migrations PASSED")
    except Exception as e:
        assert False, f"Migration failed: {e}"

def test_auth():
    """
    Tests authentication functionalities.

    Returns:
        None
    """
    from app.supabase.auth import (
        sign_up_with_email,
        sign_in_with_email,
        send_password_reset_email,
        update_password,
        sign_in_with_google
    )
    # Test email sign-up
    user = sign_up_with_email("test@example.com", "TestPassword123")
    assert user is not None

    # Test email sign-in
    session = sign_in_with_email("test@example.com", "TestPassword123")
    assert session is not None

    # Test password reset email
    send_password_reset_email("test@example.com")
    # Assume email is sent (mocking may be required)

    print("test_auth PASSED")

def test_api():
    """
    Tests CRUD operations via the Supabase API.

    Returns:
        None
    """
    from app.supabase.api import (
        create_record,
        read_records,
        update_record,
        delete_record
    )
    table_name = "test_table"

    # Test record creation
    record = create_record(table_name, {"name": "Test"})
    assert record is not None

    # Test reading records
    records = read_records(table_name)
    assert len(records) > 0

    # Test updating a record
    updated_record = update_record(table_name, record['id'], {"name": "Updated Test"})
    assert updated_record['name'] == "Updated Test"

    # Test deleting a record
    delete_response = delete_record(table_name, record['id'])
    assert delete_response is not None

    print("test_api PASSED")
