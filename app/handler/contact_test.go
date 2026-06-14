package handler

import (
	"testing"
	"errors"
	"strings"
	"net/http/httptest"
    "golang.org/x/time/rate"
)

func TestContact(t *testing.T){
	tests := []struct {
        name           string
        method         string
        body           string
        sendErr        error
        expectedStatus int
    }{
        {"valid POST",      "POST",    `{"name":"A","email":"a@b.com","message":"hi"}`, nil,                 200},
        {"wrong method",    "GET",     "",                                               nil,                 405},
        {"OPTIONS",         "OPTIONS", "",                                               nil,                 200},
        {"send fails",      "POST",    `{"name":"A","email":"a@b.com","message":"hi"}`, errors.New("smtp"), 500},
        {"invalid body",    "POST",    `not json`,                                       nil,                 400},
    }
	for _, test := range tests{
		t.Run(test.name, func(t *testing.T) {
            limiter = rate.NewLimiter(rate.Inf, 1) //so test dont break
			 h := &ContactHandler{
                Send: func(name, email, message string) error {
                    return test.sendErr
				},
			 }

			req := httptest.NewRequest(test.method, "/contact", strings.NewReader(test.body))
            w := httptest.NewRecorder()
            h.ServeHTTP(w, req)

            if w.Code != test.expectedStatus {
                t.Errorf("got %d, want %d", w.Code, test.expectedStatus)
			}
		})
	}
}

//test commit2