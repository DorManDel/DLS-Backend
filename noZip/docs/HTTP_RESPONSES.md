# HTTP Responses Guide

Did we create something new?                        -> 201

Did the request succeed normally?                   -> 200

Did the client forget required data?                -> 400

Did the requested item not exist?                   -> 404

Does the data already exist and causes conflict?    -> 409

Did the server crash unexpectedly?                  -> 500

---

## in DLS :

```
|operation                               |       code + meaning         |
|Student created a question successfully |= 201 NEW                     |   
|Teacher loaded all questions            |= 200 OK                      |   
|Question text is missing                |= 400 BAD_REQUEST             |       
|Question ID does not exist              |= 404 PAGE_NOT_FOUND          |   
|Username already exists                 |= 409 CONFLICT                |   
```