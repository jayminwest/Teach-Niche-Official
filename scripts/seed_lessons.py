import uuid
import sys
import pathlib
from datetime import datetime, timedelta
import stripe

# Add project root directory to Python path
project_root = pathlib.Path(__file__).parent.parent.resolve()
sys.path.insert(0, str(project_root))

from backend.app.supabase.client import get_supabase_client
from backend.app.stripe.client import get_stripe_client

def seed_test_lessons():
    """Seed the database with test lessons using Supabase client"""
    supabase = get_supabase_client()
    
    # Initialize Stripe client
    stripe = get_stripe_client()
    
    # Test lesson data
    test_lessons = [
        {
            "title": "Introduction to Python Programming",
            "description": "Learn Python basics with hands-on exercises",
            "price": 49.99,
            "content": "Basic Python syntax, variables, and control structures",
            "status": "published"
        },
        {
            "title": "Web Development with FastAPI",
            "description": "Build modern APIs using Python and FastAPI",
            "price": 79.99,
            "content": "FastAPI fundamentals, middleware, and database integration",
            "status": "published"
        },
        {
            "title": "React for Beginners",
            "description": "Master React fundamentals and component architecture",
            "price": 59.99,
            "content": "JSX, state management, and hooks",
            "status": "draft"
        }
    ]

    # Insert lessons
    for lesson_data in test_lessons:
        # Create Stripe product
        try:
            product = stripe.Product.create(
                name=lesson_data["title"],
                description=lesson_data["description"],
                type="service"
            )
            
            price = stripe.Price.create(
                product=product.id,
                unit_amount=int(lesson_data["price"] * 100),  # Convert to cents
                currency="usd",
            )
            
            lesson = {
                "id": str(uuid.uuid4()),
                **lesson_data,
                "creator_id": "fe225f89-132b-4ff6-8ebc-e3683f9c4416",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "stripe_product_id": product.id,
                "stripe_price_id": price.id
            }

        except Exception as e:  # Add except clause here
            print(f"Error creating Stripe product for lesson {lesson_data['title']}: {str(e)}")

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
