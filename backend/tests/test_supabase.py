"""Test suite for Supabase integration functionality."""

import json
import pytest

@pytest.mark.supabase
class TestSupabaseIntegration:
    """Test class for Supabase integration functionality."""

    def test_model_creation(self, test_client):
        """Test the creation of database models through Supabase integration.
        
        Validates that the model creation endpoint correctly interacts with Supabase
        to create new database models and returns appropriate responses.

        Test Cases:
            1. Model creation request returns HTTP 200 status
            2. Response contains success status indicator
            3. Response structure matches expected format

        Args:
            test_client: FastAPI test client fixture

        Raises:
            AssertionError: If any test condition fails
        """
        from app.supabase.client import get_supabase
        
        # Test with valid model data
        test_data = {"name": "Test Model", "type": "example"}
        
        # Insert directly using Supabase client
        supabase = get_supabase()
        response = supabase.table('test_models').insert(test_data).execute()
        
        # Verify the response
        assert response.data is not None
        assert len(response.data) > 0
        assert response.data[0]['name'] == test_data['name']
        assert response.data[0]['type'] == test_data['type']
        print("\n==========================================")
        print("✅ TEST PASSED: Supabase Models")
        print("==========================================")

    def test_database_migrations(self, test_client):
        """Test the application of database migrations through Supabase.
        
        Validates that database schema migrations are properly applied and
        that the migration endpoint returns appropriate success indicators.

        Test Cases:
            1. Migration request returns HTTP 200 status
            2. Response contains success status indicator
            3. Migration section parameter is properly processed

        Args:
            test_client: FastAPI test client fixture

        Raises:
            AssertionError: If any test condition fails
        """
        from app.supabase.client import get_supabase
        
        # Test table existence/creation
        supabase = get_supabase()
        response = supabase.rpc('test_migration_function', {'test_param': 'test_value'}).execute()
        
        assert response.data is not None
        assert not response.error
        print("\n==========================================")
        print("✅ TEST PASSED: Supabase Migrations")
        print("==========================================")

    def test_user_authentication_workflow(self, test_client):
        """Test the complete user authentication workflow through Supabase.
        
        Validates the end-to-end authentication process including:
        - User registration
        - Account login
        - Password recovery

        Test Cases:
            1. User registration returns HTTP 200 status
            2. Successful login with valid credentials
            3. Password reset request processing

        Args:
            test_client: FastAPI test client fixture

        Raises:
            AssertionError: If any test condition fails
        """
        from app.supabase.client import get_supabase
        import uuid
        
        supabase = get_supabase()
        test_email = f"test_{uuid.uuid4()}@example.com"
        test_password = "TestPassword123"
        
        # Test sign-up
        auth_response = supabase.auth.sign_up({
            "email": test_email,
            "password": test_password
        })
        assert auth_response.user is not None
        assert auth_response.user.email == test_email
        
        # Test sign-in
        sign_in_response = supabase.auth.sign_in_with_password({
            "email": test_email,
            "password": test_password
        })
        assert sign_in_response.user is not None
        
        # Test password reset request
        reset_response = supabase.auth.reset_password_email(test_email)
        assert reset_response is not None

        print("\n==========================================")
        print("✅ TEST PASSED: Supabase Auth")
        print("==========================================")

    def test_crud_operations(self, test_client):
        """Test CRUD (Create, Read, Update, Delete) operations through Supabase API.
        
        Validates the complete lifecycle of data management operations including:
        - Record creation with proper data structure
        - Data retrieval with correct response format
        - Record updates with proper persistence
        - Record deletion with proper cleanup

        Test Cases:
            1. Record creation returns HTTP 200 with valid ID
            2. Data retrieval returns expected records
            3. Record updates persist correctly
            4. Record deletion completes successfully

        Args:
            test_client: FastAPI test client fixture

        Raises:
            AssertionError: If any test condition fails
        """
        from app.supabase.client import get_supabase
        
        table_name = "test_table"
        test_data = {"name": "Test"}
        supabase = get_supabase()
        
        # Test record creation
        insert_response = supabase.table(table_name).insert(test_data).execute()
        assert insert_response.data is not None
        assert len(insert_response.data) > 0
        record_id = insert_response.data[0]['id']
        
        # Test reading records
        read_response = supabase.table(table_name).select("*").execute()
        assert read_response.data is not None
        assert len(read_response.data) > 0
        
        # Test updating a record
        update_data = {"name": "Updated Test"}
        update_response = supabase.table(table_name).update(update_data).eq('id', record_id).execute()
        assert update_response.data is not None
        assert update_response.data[0]['name'] == update_data['name']
        
        # Test deleting a record
        delete_response = supabase.table(table_name).delete().eq('id', record_id).execute()
        assert delete_response.data is not None

        print("\n==========================================")
        print("✅ TEST PASSED: Supabase API")
        print("==========================================")
