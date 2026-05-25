package main

import (
    "encoding/json"
    "net/http"
)

func main() {
    http.HandleFunc("/contact", contactHandler)
    http.ListenAndServe(":8080", nil)
}

