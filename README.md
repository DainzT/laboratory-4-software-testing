Kaizen Somosera & Dainz Trasadas
# Initialize
    - git clone "https://github.com/DainzT/laboratory-4-software-testing.git"

# Set up Environmentail Variables
    # Frontend (client)
        ### Create a .env and .env.test file and put the following inside:
            - VITE_API_BASE_URL=http://localhost:3002/api
            - BASE_URL=http://localhost:5173

    # Backend (server)
        ### Create a .env and .env.test file and put the following inside:
            - DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNjRhMTc5YzktODgxOS00ZmNmLThlMTYtN2M2NDQxZjBmNjFmIiwidGVuYW50X2lkIjoiMmFmNTViMWYwMDE4YWQwMDQ4OTE4ZGJiYzgxMzcyMzZkYzExYWUyZWNiN2VmOGQzZDVjY2NlOGE5MDdmMjE4MSIsImludGVybmFsX3NlY3JldCI6IjdmODdhYmYzLWQ3MmUtNDIzYy1iMWRjLWFkZWY1YjBlYWFjYiJ9.z0h1qOVeatyihgbZ7hAHAc38ulWnpEBRngcLdiiE8DE"
            - PORT=3002

# Testing
    - cd client
    - run "npm run test:e2e"

*ps. some tests will have an error due to the internet connection, slow testing browsers, or just the browser being buggy >:(*
