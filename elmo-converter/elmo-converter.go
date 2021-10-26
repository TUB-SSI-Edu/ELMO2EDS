package main

import (
	"github.com/antchfx/xmlquery"
	"log"
	"os"
)

func main() {
	log.Println("### elmo converter ###")

	//check if path is given
	if len(os.Args) < 1 {

	}
	// read xml path from command line argument
	var xmlPath = os.Args[1]
	f, err := os.Open(xmlPath)
	log.Println("parsing xml file at relative path %s", xmlPath)
	if err != nil {
		f.Close()
		log.Fatalf("failed to open xml at %s: %v", xmlPath, err)
	}
	doc, err := xmlquery.Parse(f)
	if err != nil {
		f.Close()
		log.Fatalf("failed to parse xml: %v", err)
	} else {
		log.Printf("parsing of %s successfull:\n%v", xmlPath, doc)
	}
	f.Close()

}
