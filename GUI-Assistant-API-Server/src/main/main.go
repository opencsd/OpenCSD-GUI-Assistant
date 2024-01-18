package main

import (
	"net/http"
	"fmt"

	sh "api-server/src/handler"
)

func main() {
	fmt.Println("[GUI Assistant API Server] Running..")

	//handler
	http.HandleFunc("/opencsd/create", sh.CreateOpenCSDHandler)
	http.HandleFunc("/mysql/create", sh.CreateMySQLHandler)
	http.ListenAndServe(":8000", nil)
}
