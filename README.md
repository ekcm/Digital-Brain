<h2 align="center">Digital Brain</h2>
<p align="center">
  A simple RAG application designed to upload and query your PDF files, built with Python and Next.js, hosted on AWS and Vercel.
</p>

### Built With
* Python
* FastAPI
* Nextjs
* TypeScript
* LangChain
* Pinecone
* AWS S3
* OpenAI API

### Getting Started on your local machine
1. Clone the repo
```sh
git clone https://github.com/ekcm/Digital-Brain.git
```

2. Create a .env file in both the Backend and Frontend folder

Backend:
```sh
OPENAI_API_KEY=<<your-openai-api-key>>
PINECONE_API_KEY=<<your-pinecone-api-key>>
AWS_ACCESS_KEY_ID=<<your-aws-access-key-id>>
AWS_SECRET_ACCESS_KEY=<<your-aws-secret-access-key>>
AWS_BUCKET_NAME=<<your-aws-bucket-name>>
AWS_REGION=<<your-aws-region>>
```

Frontend:
```sh
NEXT_PUBLIC_BACKEND_API_URL=http://0.0.0.0:8000/v1 # reference for local development only
```

3. Run Docker Compose to start the application
```sh
docker-compose up -d
```

4. Access the application on the Frontend at `http://localhost:3000`

You can also access the backend api docs at `http://localhost:8000/docs`
