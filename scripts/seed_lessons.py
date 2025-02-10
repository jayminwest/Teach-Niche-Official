import uuid
from datetime import datetime, timedelta
from backend.app.supabase.client import get_supabase_client

def seed_test_lessons():
    """Seed the database with test lessons using Supabase client"""
    supabase = get_supabase_client()
    
    # Test lesson data
    test_lessons = [
        {
            "id": str(uuid.uuid4()),
            "title": "Introduction to Python Programming",
            "description": "Learn Python basics with hands-on exercises",
            "price": 49.99,
            "creator_id": "fe225f89-132b-4ff6-8ebc-e3683f9c4416",  # Test user profile
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "stripe_product_id": "prod_XXXXXXXXXXXXXX",
            "stripe_price_id": "price_XXXXXXXXXXXXXX",
            "content": "Basic Python syntax, variables, and control structures",
            "status": "published"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Web Development with FastAPI",
            "description": "Build modern APIs using Python and FastAPI",
            "price": 79.99,
            "creator_id": "fe225f89-132b-4ff6-8ebc-e3683f9c4416",
            "created_at": (datetime.now() - timedelta(days=2)).isoformat(),
            "updated_at": datetime.now().isoformat(),
            "stripe_product_id": "prod_YYYYYYYYYYYYYY",
            "stripe_price_id": "price_YYYYYYYYYYYYYY",
            "content": "FastAPI fundamentals, middleware, and database integration",
            "status": "published"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "React for Beginners",
            "description": "Master React fundamentals and component architecture",
            "price": 59.99,
            "creator_id": "fe225f89-132b-4ff6-8ebc-e3683f9c4416",
            "created_at": (datetime.now() - timedelta(days=5)).isoformat(),
            "updated_at": datetime.now().isoformat(),
            "stripe_product_id": "prod_ZZZZZZZZZZZZZZ",
            "stripe_price_id": "price_ZZZZZZZZZZZZZZ",
            "content": "JSX, state management, and hooks",
            "status": "draft"
        }
    ]

    # Insert lessons
    for lesson in test_lessons:
        try:
            result = supabase.table("lessons").insert(lesson).execute()
            if result.data:
                print(f"Inserted lesson: {lesson['title']}")
            else:
                print(f"Failed to insert lesson: {lesson['title']}")
        except Exception as e:
            print(f"Error inserting lesson {lesson['title']}: {str(e)}")

if __name__ == "__main__":
    seed_test_lessons()
