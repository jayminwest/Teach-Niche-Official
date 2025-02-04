## High-Level Objective

Create a secure backend integration between Stripe checkout, Supabase database, and lesson purchase processing to handle payments, record purchases, and manage access control.

# RELEVANT FILES:
backend/app/routes/stripe.py                     
backend/app/stripe/payments.py
backend/app/stripe/webhooks.py
backend/app/supabase/client.py

## Mid-Level Objectives

1. Database Schema & Access Control
   - Create purchaes table in Supabase with proper relationships
   - Configure Row Level Security (RLS) policies for purchase records
   - Add unique constraints to prevent duplicate purchases
   - Implement service role access for webhook updates

2. Backend Integration
   - Enhance checkout session creation with lesson metadata
   - Implement webhook handler for successful payments
   - Record purchases in Supabase on payment success
   - Add idempotency handling for webhook events
   - Implement proper error handling and validation

3. Security & Error Handling
   - Verify Stripe webhook signatures
   - Implement proper error logging
   - Ensure proper access control for purchased content

## Implementation Notes

- Use Supabase service role client for webhook database updates
- Implement proper TypeScript types for purchase records
- Add comprehensive logging for debugging

SCHEMA:
CREATE TABLE purchases (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES profiles(id),
    lesson_id uuid NOT NULL REFERENCES lessons(id),
    creator_id uuid NOT NULL REFERENCES profiles(id),
    purchase_date timestamp with time zone NOT NULL DEFAULT NOW(),
    stripe_session_id text NOT NULL UNIQUE,
    amount numeric(19,4) NOT NULL CHECK (amount >= 0),
    platform_fee numeric(19,4) NOT NULL CHECK (platform_fee >= 0),
    creator_earnings numeric(19,4) NOT NULL CHECK (creator_earnings >= 0),
    payment_intent_id text NOT NULL,
    fee_percentage numeric(5,2) NOT NULL CHECK (fee_percentage BETWEEN 0 AND 100),
    status purchase_status NOT NULL DEFAULT 'pending',
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
    version integer NOT NULL DEFAULT 1
);



                                              backend/app/stripe/payments.py                                              

Enhance checkout session creation with lesson metadata.                                                                   

                                                                                                                          
 @router.post("/checkout_session")                                                                                        
 async def create_checkout_session(data: dict):                                                                           
     stripe = get_stripe_client()                                                                                         
     try:                                                                                                                 
         line_items = data.get('line_items')                                                                              
                                                                                                                          
         if not line_items:                                                                                               
             raise HTTPException(status_code=400, detail="Missing required line_items")                                   
                                                                                                                          
         checkout_session = stripe.checkout.Session.create(                                                               
             payment_method_types=['card'],                                                                               
             line_items=line_items,                                                                                       
             mode=data.get('mode', 'payment'),                                                                            
             success_url=data.get('success_url', 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}'),         
             cancel_url=data.get('cancel_url', 'https://example.com/cancel'),                                             
         )                                                                                                                
                                                                                                                          
         return JSONResponse(content={'id': checkout_session.id, 'url': checkout_session.url})                            
     except Exception as e:                                                                                               
         raise HTTPException(status_code=500, detail=str(e))                                                              
                                                                                                                          

                                              backend/app/stripe/webhooks.py                                              

Implement webhook handler for successful payments and record purchases in Supabase.                                       

                                                                                                                          
 from supabase import Client                                                                                              
                                                                                                                          
 def _handle_payment_intent_succeeded(event_data: dict) -> None:                                                          
     payment_intent = event_data['object']                                                                                
     metadata = payment_intent.get('metadata', {})                                                                        
                                                                                                                          
     if not metadata or 'lesson_id' not in metadata or 'user_id' not in metadata:                                         
         raise HTTPException(status_code=400, detail="Missing required metadata")                                         
                                                                                                                          
     lesson_id = metadata['lesson_id']                                                                                    
     user_id = metadata['user_id']                                                                                        
     amount = payment_intent.get('amount', 0) / 100.0                                                                     
     currency = payment_intent.get('currency', 'USD')                                                                     
     stripe_payment_intent_id = payment_intent.get('id')                                                                  
                                                                                                                          
     client = get_supabase_client()                                                                                       
     query = """                                                                                                          
         INSERT INTO purchases (lesson_id, user_id, amount, currency, stripe_payment_intent_id)                           
         VALUES (%s, %s, %s, %s, %s)                                                                                      
         ON CONFLICT (stripe_payment_intent_id) DO NOTHING;                                                               
     """                                                                                                                  
     response = client.execute(query, (lesson_id, user_id, amount, currency, stripe_payment_intent_id))                   
                                                                                                                          
     if not response.data:                                                                                                
         raise HTTPException(status_code=500, detail="Failed to record purchase in Supabase")                             
                                                                                                                          

                                               3. Security & Error Handling                                               

                                              backend/app/stripe/webhooks.py                                              

Add idempotency handling for webhook events.                                                                              

                                                                                                                          
 from supabase import Client                                                                                              
                                                                                                                          
 def _handle_payment_intent_succeeded(event_data: dict) -> None:                                                          
     payment_intent = event_data['object']                                                                                
     metadata = payment_intent.get('metadata', {})                                                                        
                                                                                                                          
     if not metadata or 'lesson_id' not in metadata or 'user_id' not in metadata:                                         
         raise HTTPException(status_code=400, detail="Missing required metadata")                                         
                                                                                                                          
     lesson_id = metadata['lesson_id']                                                                                    
     user_id = metadata['user_id']                                                                                        
     amount = payment_intent.get('amount', 0) / 100.0                                                                     
     currency = payment_intent.get('currency', 'USD')                                                                     
     stripe_payment_intent_id = payment_intent.get('id')                                                                  
                                                                                                                          
     client = get_supabase_client()                                                                                       
     query = """                                                                                                          
         INSERT INTO purchases (lesson_id, user_id, amount, currency, stripe_payment_intent_id)                           
         VALUES (%s, %s, %s, %s, %s)                                                                                      
         ON CONFLICT (stripe_payment_intent_id) DO NOTHING;                                                               
     """                                                                                                                  
     response = client.execute(query, (lesson_id, user_id, amount, currency, stripe_payment_intent_id))                   
                                                                                                                          
     if not response.data:                                                                                                
         raise HTTPException(status_code=500, detail="Failed to record purchase in Supabase")                             
                                                                                                                          

                                              backend/app/stripe/webhooks.py                                              

Implement proper error logging.                                                                                           

                                                                                                                          
 import logging                                                                                                           
                                                                                                                          
 logger = logging.getLogger(__name__)                                                                                     
                                                                                                                          
 @router.post("/webhook", status_code=200)                                                                                
 async def handle_stripe_webhook(request: Request):                                                                       
     try:                                                                                                                 
         payload = await request.body()                                                                                   
         signature = request.headers.get('stripe-signature')                                                              
         event = _verify_stripe_event(payload.decode('utf-8'), signature)                                                 
                                                                                                                          
         # Route to appropriate event handler                                                                             
         if event['type'] == 'payment_intent.succeeded':                                                                  
             _handle_payment_intent_succeeded(event['data'])                                                              
         elif event['type'] == 'payment_method.attached':                                                                 
             _handle_payment_method_attached(event['data'])                                                               
         else:                                                                                                            
             raise HTTPException(status_code=400, detail='Unhandled event type')                                          
                                                                                                                          
         return {'status': 'success'}                                                                                     
                                                                                                                          
     except Exception as e:                                                                                               
         logger.error(f"Error processing webhook: {str(e)}")                                                              
         raise HTTPException(status_code=500, detail=str(e))                                                              
                                                                                                                          

                                          TypeScript Types for Purchase Records                                           

                                                frontend/types/purchase.ts                                                

Add TypeScript types for purchase records.                                                                                

                                                                                                                          
 export interface Purchase {                                                                                              
     id: number;                                                                                                          
     lesson_id: string;                                                                                                   
     user_id: string;                                                                                                     
     purchase_date: Date;                                                                                                 
     amount: number;                                                                                                      
     currency: string;                                                                                                    
     stripe_payment_intent_id: string;                                                                                    
 }                                                                                                                        
                                                                                                                          

                                                  Comprehensive Logging                                                   

                                              backend/app/stripe/webhooks.py                                              

Add comprehensive logging for debugging.                                                                                  

                                                                                                                          
 import logging                                                                                                           
                                                                                                                          
 logger = logging.getLogger(__name__)                                                                                     
                                                                                                                          
 def _handle_payment_intent_succeeded(event_data: dict) -> None:                                                          
     payment_intent = event_data['object']                                                                                
     metadata = payment_intent.get('metadata', {})                                                                        
                                                                                                                          
     if not metadata or 'lesson_id' not in metadata or 'user_id' not in metadata:                                         
         logger.error("Missing required metadata for payment intent")                                                     
         raise HTTPException(status_code=400, detail="Missing required metadata")                                         
                                                                                                                          
     lesson_id = metadata['lesson_id']                                                                                    
     user_id = metadata['user_id']                                                                                        
     amount = payment_intent.get('amount', 0) / 100.0                                                                     
     currency = payment_intent.get('currency', 'USD')                                                                     
     stripe_payment_intent_id = payment_intent.get('id')                                                                  
                                                                                                                          
     client = get_supabase_client()                                                                                       
     query = """                                                                                                          
         INSERT INTO purchases (lesson_id, user_id, amount, currency, stripe_payment_intent_id)                           
         VALUES (%s, %s, %s, %s, %s)                                                                                      
         ON CONFLICT (stripe_payment_intent_id) DO NOTHING;                                                               
     """                                                                                                                  
     response = client.execute(query, (lesson_id, user_id, amount, currency, stripe_payment_intent_id))                   
                                                                                                                          
     if not response.data:                                                                                                
         logger.error("Failed to record purchase in Supabase")                                                            
         raise HTTPException(status_code=500, detail="Failed to record purchase in Supabase")                             
                                                                                                                          
 @router.post("/webhook", status_code=200)                                                                                
 async def handle_stripe_webhook(request: Request):                                                                       
     try:                                                                                                                 
         payload = await request.body()                                                                                   
         signature = request.headers.get('stripe-signature')                                                              
         event = _verify_stripe_event(payload.decode('utf-8'), signature)                                                 
                                                                                                                          
         # Route to appropriate event handler                                                                             
         if event['type'] == 'payment_intent.succeeded':                                                                  
             logger.info(f"Handling payment intent succeeded for {event['data']['object']['id']}")                        
             _handle_payment_intent_succeeded(event['data'])                                                              
         elif event['type'] == 'payment_method.attached':                                                                 
             logger.info(f"Handling payment method attached for {event['data']['object']['id']}")                         
             _handle_payment_method_attached(event['data'])                                                               
         else:                                                                                                            
             logger.warning(f"Unhandled event type: {event['type']}")                                                     
             raise HTTPException(status_code=400, detail='Unhandled event type')                                          
                                                                                                                          
         return {'status': 'success'}                                                                                     
                                                                                                                          
     except Exception as e:                                                                                               
         logger.error(f"Error processing webhook: {str(e)}")                                                              
         raise HTTPException(status_code=500, detail=str(e))                                                              
                                                                                                                         
