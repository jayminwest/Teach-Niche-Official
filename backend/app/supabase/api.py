from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from app.supabase.client import get_supabase_client

# Get the supabase client instance
supabase = get_supabase_client()

class APIResponse(BaseModel):
    status: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

def create_record(table: str, data: Dict[str, Any]) -> APIResponse:
    """
    Inserts a new record into the specified table.

    Args:
        table (str): The name of the table.
        data (dict): The data to insert.

    Returns:
        dict: The inserted record.

    Raises:
        Exception: If the insertion fails.
    """
    response = supabase.table(table).insert(data).execute()
    if response.get('error'):
        raise Exception(f"Insert failed: {response['error']}")
    return response.get('data', {})

def read_records(table: str, query: dict = None) -> list:
    """
    Reads records from the specified table.

    Args:
        table (str): The name of the table.
        query (dict, optional): Query parameters.

    Returns:
        list: List of retrieved records.

    Raises:
        Exception: If the read operation fails.
    """
    query_builder = supabase.table(table)
    if query:
        for key, value in query.items():
            query_builder = query_builder.eq(key, value)
    response = query_builder.execute()
    if response.get('error'):
        raise Exception(f"Read failed: {response['error']}")
    return response.get('data', [])

def update_record(table: str, record_id: int, data: dict) -> dict:
    """
    Updates a record in the specified table.

    Args:
        table (str): The name of the table.
        record_id (int): The ID of the record to update.
        data (dict): The new data to update.

    Returns:
        dict: The updated record.

    Raises:
        Exception: If the update fails.
    """
    response = supabase.table(table).update(data).eq('id', record_id).execute()
    if response.get('error'):
        raise Exception(f"Update failed: {response['error']}")
    return response.get('data', {})

def delete_record(table: str, record_id: int) -> dict:
    """
    Deletes a record from the specified table.

    Args:
        table (str): The name of the table.
        record_id (int): The ID of the record to delete.

    Returns:
        dict: The deletion response.

    Raises:
        Exception: If the deletion fails.
    """
    response = supabase.table(table).delete().eq('id', record_id).execute()
    if response.get('error'):
        raise Exception(f"Delete failed: {response['error']}")
    return response.get('data', {})
