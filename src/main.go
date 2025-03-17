package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Merhaba, Attack on Titan API'sine hoş geldiniz!")
	})

	fmt.Println("Sunucu 8080 portunda başlatılıyor...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Sunucu başlatılamadı: %v", err)
	}
}
