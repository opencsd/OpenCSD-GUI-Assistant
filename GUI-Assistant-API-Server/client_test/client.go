package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
)

var (
	HOST = "10.0.4.87:30010"
)

func requestURL(id string, url string) {
    fmt.Println("[ ID  : ", id , "]")
    fmt.Println("[ URL : ", url , "]")
    req, _ := http.NewRequest("GET", url, nil)

    client := &http.Client{}
    res, err := client.Do(req)

    if err != nil {
        panic(err)
    }

    defer res.Body.Close()
    thisBody, err := ioutil.ReadAll(res.Body)

    if err != nil {
        panic(err)
    }

    fmt.Println(string(thisBody))
}

func main() {
    requestURL("CreateOpenCSDHandler", "http://"+HOST+"/opencsd/create?dbname=test")
}

