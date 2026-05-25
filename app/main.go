package main

import (
    "net/http"
    "portfoliosite/handler"
)

func main() {
    http.HandleFunc("/contact", handler.ContactHandler)
    http.ListenAndServe(":8080", nil)
}

