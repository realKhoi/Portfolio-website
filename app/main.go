package main

import (
    "net/http"
    "portfolio-website/handler"
)

func main() {
    http.Handle("/contact", &handler.ContactHandler{Send: handler.SendEmail})
    http.ListenAndServe(":8080", nil)
}

