import pytest

@pytest.mark.asyncio
async def test_basic():
    """Basic test to verify pytest is working."""
    assert True

def test_sync():
    """A synchronous test to verify pytest is working."""
    assert True
