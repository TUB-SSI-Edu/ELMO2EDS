package main

import (
	"encoding/xml"
	"github.com/antchfx/xmlquery"
	"log"
	"os"
)

func getTypeFromXML(navigator *xmlquery.NodeNavigator) string {
	return xmlquery.FindOne(navigator.Current(), "//learningOpportunitySpecification//title[@xml:lang='en']").InnerText()
}

func loadXML(xmlPath string) *xmlquery.NodeNavigator {
	// open file
	f, err := os.Open(xmlPath)
	log.Printf("parsing xml file at relative path %s\n", xmlPath)
	if err != nil {
		f.Close()
		log.Fatalf("failed to open xml at %s: %v", xmlPath, err)
	}
	// read XML
	parsed, err := xmlquery.Parse(f)
	if err != nil {
		f.Close()
		log.Fatalf("failed to read xml: %v", err)
	}
	f.Close()
	// create Navigator to move through xml structure
	elmoNode := xmlquery.FindOne(parsed, "//elmo")
	doc := xmlquery.CreateXPathNavigator(elmoNode)
	return doc
}

func parseXMLToCredential(navigator *xmlquery.NodeNavigator) EducationCredential {
	// create struct to parse xml into
	credential := CreateCredential(getTypeFromXML(navigator))
	// dump xml data into struct
	err := xml.Unmarshal([]byte(navigator.Current().OutputXML(true)), &credential)
	if err != nil {
		log.Fatalf("error while parsing xml file: %s", err)
	}
	return credential
}

func main() {
	log.Println("### elmo converter ###")

	/// --- PARSING XML --- ///

	// check if path is given
	if len(os.Args) < 1 {
		log.Fatal("no path given")
	}
	// read xml path from command line argument
	xmlPath := os.Args[1]

	doc := loadXML(xmlPath)
	// print current node data
	log.Printf("reading of %s successfull!", doc.Current().InnerText())

	// --------------
	// 		QUERY
	// --------------
	docType := getTypeFromXML(doc)
	log.Printf("type of document: %s\n", docType)

	// parse XML to struct
	credential := parseXMLToCredential(doc)

	// parse to JSON
	json := credential.ToJson()

	// log result
	log.Printf("parsing successful: \n%s", json)

}
