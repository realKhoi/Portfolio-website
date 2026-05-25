package main

import (
    "net/http"
    "portfoliosite/handler"
)

func main() {
    http.HandleFunc("/contact", ContactHandler)
    http.ListenAndServe(":8080", nil)
}

