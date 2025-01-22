from typing import Dict, Any
from app.supabase.client import get_supabase_client

def apply_migration(section: str, migration_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Applies migrations to a specified section of the database.

    Args:
        section (str): The section of the database to migrate
        migration_data (Dict[str, Any]): Migration data including SQL commands

    Returns:
        Dict[str, Any]: Migration results

    Raises:
        Exception: If migration fails
    """
    supabase = get_supabase_client()
    
    try:
        # Execute raw SQL for migrations
        response = supabase.rpc('execute', {
            'query': migration_data.get('sql')
        }).execute()
        
        if response.get('error'):
            raise Exception(f"Migration failed: {response['error']}")
            
        return {
            'status': 'success',
            'data': response.get('data', {})
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }
