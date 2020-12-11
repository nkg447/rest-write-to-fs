# Rest Write to FS
A node based cli to run a local server to write to text file in file system. A sample use case can be wrting data to file system from postman automation script.

## How to install
```
npm install -g rest-write-to-fs
```

## How to use
```
Usage: rest-write-to-fs [-options]
where options include:
    -p --port          PORT number (default is 8000)
    -f --folder        Path to the directory to store the files (default is the current working directory)
```

## Endpoints
* Append - POST `/append?file=fileName`
Will append data sent in request body to fileName.
* Write - POST `/writw?file=fileName`
Will create/override data sent in request body to fileName 

