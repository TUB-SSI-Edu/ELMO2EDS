package main

import (
	"github.com/antchfx/xmlquery"
	"log"
	"os"
)

func main() {
	log.Println("### elmo converter ###")

	/// --- PARSING XML --- ///

	// check if path is given
	if len(os.Args) < 1 {
		log.Fatal("no path given")
	}

	// read xml path from command line argument
	var xmlPath = os.Args[1]
	f, err := os.Open(xmlPath)
	log.Printf("parsing xml file at relative path %s\n", xmlPath)
	if err != nil {
		f.Close()
		log.Fatalf("failed to open xml at %s: %v", xmlPath, err)
	}
	parsed, err := xmlquery.Parse(f)
	if err != nil {
		f.Close()
		log.Fatalf("failed to parse xml: %v", err)
	}
	// create Navigator to move through xml structure
	doc := xmlquery.CreateXPathNavigator(parsed)
	log.Printf("parsing of %s successfull!", doc.Current().InnerText())
	f.Close()

	// --------------
	// 		QUERY
	// --------------
	docType := xmlquery.FindOne(doc.Current(), "//learningOpportunitySpecification//title[@xml:lang='en']").InnerText()
	log.Printf("type of document: %s\n", docType)

}
