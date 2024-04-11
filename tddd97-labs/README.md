Activate the virtual environment


Install all necessary packages using the command:
"pip install -r requirements.txt"


In Lab4_Twidder, run:
" gunicorn -b 0.0.0.0:8000 --workers 1 --threads 100 server:app "


Access the application in a web browser using the address 
"http://localhost:8000/"
