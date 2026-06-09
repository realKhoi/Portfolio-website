package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/smtp"
	"golang.org/x/time/rate"
	"os"
)

var limiter = rate.NewLimiter(0.1, 1)

type ContactHandler struct {
    Send func(name, email, message string) error
}

func (h *ContactHandler) ServeHTTP(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
    w.WriteHeader(http.StatusOK)
    return
	}

	if r.Method != http.MethodPost { 
		http.Error(w, "REST Method '"+r.Method+"' not supported. Currently only '"+http.MethodGet+
			"'are supported.", http.StatusMethodNotAllowed)
		return
	}

	if !limiter.Allow() {
        http.Error(w, "too many requests", http.StatusTooManyRequests)
        return
	}

	var req ContactRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
    http.Error(w, "invalid body", http.StatusBadRequest)
    return
}

	err := h.Send(req.Name, req.Email, req.Message)
    if err != nil {
        http.Error(w, "failed to send", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"status": "sent"})

}

func SendEmail(name, email, message string) error {
	from := os.Getenv("GMAIL")
	password := os.Getenv("GMAIL_PASSWORD")
	to := os.Getenv("GMAIL")

	subject := "New contact form message"
    body := fmt.Sprintf("From: %s\nEmail: %s\n\n%s", name, email, message)

    msg := "From: " + from + "\n" +
        "To: " + to + "\n" +
        "Subject: " + subject + "\n\n" +
        body

    auth := smtp.PlainAuth("", from, password, "smtp.gmail.com")
	return smtp.SendMail("smtp.gmail.com:587", auth, from, []string{to}, []byte(msg))
}