# My Blog Project

http//78.149.69.229:3003

A simple blog showcasing posts and personal notes. This project uses Docker for local development and testing.

## Prerequisites
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Steps

1) OPEN THE PROJECT IN VS CODE  
--------------------------------  
- Launch VS Code.  
- Go to "File → Open Folder…".  
- Select the folder containing your project (e.g., "my-blog/").  

2) RUN THE PROJECT WITH DOCKER  
--------------------------------  
- In VS Code, open a terminal (View → Terminal).  
- Make sure you're in the same folder as "docker-compose.yml".  
- Run:  
    ```
    docker-compose up -d --build
    ```
- (Optional) Check logs:  
    ```
    docker-compose logs -f
    ```
- To stop everything:  
    ```
    docker-compose down
    ```

3) TEST LOCALLY IN YOUR BROWSER  
--------------------------------  
- If docker-compose maps port 80, go to:  
    ```
    http://localhost
    ```
- If it maps a different port (e.g., 8080:3000), go to:  
    ```
    http://localhost:8080
    ```

4) SHUT DOWN  
--------------------------------  
```
docker-compose down
```


## License
Distributed under the MIT License.
