package main

import (
	"fmt"
	"github.com/antchfx/xmlquery"
	"os"
)

func main() {
	fmt.Println("### elmo converter ###")

	// read xml path from command line argument
	var xmlPath = os.Args[1]
	f, err := os.Open(xmlPath)
	fmt.Println("parsing xml file at relative path %s", xmlPath)
	if err != nil {
		fmt.Errorf("failed to open xml at %s: %v", xmlPath, err)
		f.Close()
	}
	doc, err := xmlquery.Parse(f)
	if err != nil {
		fmt.Errorf("failed to parse xml: %v", err)
	} else {
		fmt.Printf("parsing of %s successfull:\n%v", xmlPath, doc)
	}
	f.Close()

}
