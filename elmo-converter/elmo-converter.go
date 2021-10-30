package main

import (
	"encoding/xml"
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
	xmlPath := os.Args[1]
	f, err := os.Open(xmlPath)
	log.Printf("parsing xml file at relative path %s\n", xmlPath)
	if err != nil {
		f.Close()
		log.Fatalf("failed to open xml at %s: %v", xmlPath, err)
	}
	parsed, err := xmlquery.Parse(f)
	if err != nil {
		f.Close()
		log.Fatalf("failed to read xml: %v", err)
	}
	f.Close()
	// create Navigator to move through xml structure
	doc := xmlquery.CreateXPathNavigator(parsed)
	// move to elmo xml node
	doc.MoveToChild()
	doc.MoveToNext()
	// print current node data
	log.Printf("reading of %s successfull!", doc.Current().InnerText())

	// --------------
	// 		QUERY
	// --------------
	docType := xmlquery.FindOne(doc.Current(), "//learningOpportunitySpecification//title[@xml:lang='en']").InnerText()
	log.Printf("type of document: %s\n", docType)

	// create struct to parse xml into
	credential := CreateCredential(docType)
	// dump xml data into struct
	err = xml.Unmarshal([]byte(doc.Current().OutputXML(true)), &credential)
	if err != nil {
		log.Fatalf("error while parsing xml file: %s", err)
	}
	// log result
	log.Printf("parsing successful: \n%s", credential.ToJson())

}
