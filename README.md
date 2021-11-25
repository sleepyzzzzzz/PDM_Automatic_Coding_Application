Frontend: React

Backend: Java

The application uses websocket to send message data between the frontend and backend.

It only support **csv** files for uploading. Multi-fields keys searching are implemented. It finds any string that contains the search key for a specific field (regex used). For value searches, the user need to click on the search symbol to run the filter implementation.

Currently using MongoDB to dynamically store and find the data (have some latency in fetching data from the database, may configure a Jedis for future improvement). Multiple users can be online at the same time, but other users can only see the chosen csv file's fields without data (stuck on how to retrieve file binary content (maybe redis will solve it?))

Instruction for Using

1. start the java backend first

2. start the React (if there is a 'connect' in the console window, it's good to go)
