import sys
import os

# Add the project root to sys.path for backend imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.api.main import app

# Vercel needs the app instance at the root of the api module
# Or it can be imported as 'app'
