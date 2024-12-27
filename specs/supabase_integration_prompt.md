# Supabase Integration v0 Specification
> Ingest the information from this file, implement the Low-Level Tasks, and generate the code that will satisfy the High and Mid-Level Objectives.

## High-Level Objective
- Integrate Supabase API features along with testing infrastructure

## Mid-Level Objective
- Database Management via RESTful API.
- CRUD operations via Supabase API.
- Authentication and Authorization with Email's and Google Sign In via the API.
- Row Level Security best practices with JWT verification. 
- Edge functions skeleton for future integration with other backend services. 
- Centralized environment variable storage.
- Pytest testing for all of the above features. 
- Setup functionality for importing SQL models and migrations. 

## Implementation Notes
- Comment every function and class thoroughly using Google styling (docstrings explaining purpose, parameters, return values, and exception handling).
- Carefully review each low-level task for exact code changes.
- Tests should be comprehensive with a focus on security (including proper signature verification and edge-case handling). 
- Tests should print "PASSED" when complete
- Code should be as modular and simple as possible:
- Only use dependencies found in `pyproject.toml`.
- **All secrets, such as `NEXT_PUBLIC_SUPABASE_URL` and 'NEXT_PUBLIC_SUPABASE_ANON_KEY', are stored in backend/app/core/config.py**
- Functions used in multiple files should be placed in `backend/app/supabase/utils.py`


## Context

### Beginning context
- `backend/app/supabase/client.py`
- `backend/pyproject.toml` (**readonly**)
- `backend/app/core/config.py` (**readonly**)

### Ending context
- `backend/app/supabase/client.py`
- `backend/pyproject.toml` (**readonly**)
- `backend/app/core/config.py` (**readonly**)
- `backend/app/supabase/models.py`
- `backend/app/supabase/migrations.py`
- `backend/app/supabase/auth.py`
- `backend/app/supabase/api.py`
- `backend/app/supabase/edge_functions.py`
- `backend/app/supabase/utils.py`
- `backend/tests/test_supabase.py`


## Low-Level Tasks
> Ordered from start to finish

1. Create `backend/app/supabase/models.py` and `backend/app/supabase/migrations.py`
```aider
CREATE backend/app/supabase/models.py:
    CREATE skeleton file for future database models and schemas.

CREATE backend/app/supabase/migrations.py:
    CREATE function to apply migrations to specified sections of the DB. Should be general purpose. 

UPDATE backend/tests/test_supabase.py:
    CREATE def test_models(),
    CREATE def test_migrations().
```

2. Create `backend/app/supabase/auth.py`
```aider
CREATE backend/app/supabase/auth.py:
    CREATE def sign_up_with_email(), 
    CREATE def sign_in_with_email(),
    CREATE def send_password_reset_email(),
    CREATE def update_password(),
    CREATE sign_in_with_google().

UPDATE backend/tests/test_supabase.py:
    CREATE def test_auth().
```

3. Create `backend/app/supabase/api.py`
```aider
CREATE backend/app/supabase/api.py:
    CREATE CRUD operations for DB.

UPDATE backend/tests/test_supabase.py:
    CREATE def test_api():
        ADD tests for all CRUD operations. 
```

4. Create `backend/app/supabase/edge_functions.py`
```aider
CREATE backend/app/supabase/edge_functions.py:
    CREATE skeleton EdgeFunction() class for future edge functions. 
```

5. Create `backend/tests/test_supabase.py`
```aider
CREATE backend/tests/test_supabase.py:
    ADD all aforementioned tests
```