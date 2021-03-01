package main

import (
	"net/http"
	"os"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./dist")))

	port := os.Getenv("FC_SERVER_PORT")
	if port == "" {
		port = "9000"
	}

	http.ListenAndServe(":"+port, nil)
}
