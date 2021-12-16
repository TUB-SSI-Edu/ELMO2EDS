package main

import (
	"encoding/json"
	"encoding/xml"
	"log"
)

type Identifier struct {
	Type  string `xml:"type,attr"`
	Value string `xml:",innerxml"`
}

type Text struct {
	Lang  string `xml:"lang,attr"`
	Value string `xml:",innerxml"`
}

type Issuer struct {
	Country    string     `xml:"country"`
	Identifier Identifier `xml:"identifier"`
	Titles     []Text     `xml:"title"`
	URL        string     `xml:"url"`
}

type Learner struct {
	Citizenship  string       `xml:"citizenship"`
	Identifiers  []Identifier `xml:"identifier"`
	GivenNames   string       `xml:"givenNames"`
	FamilyName   string       `xml:"familyName"`
	Bday         string       `xml:"bday"`
	PlaceOfBirth string       `xml:"placeOfBirth"`
	Gender       int          `xml:"gender"`
}

type Credit struct {
	Scheme string  `xml:"scheme"`
	Value  float32 `xml:"value"`
}

type Level struct {
	Type        string  `xml:"type"`
	Description Text    `xml:"description"`
	Value       float32 `xml:"value"`
}

type LearningOpportunityInstance struct {
	Credits []Credit `xml:"credit"`
	Level   Level    `xml:"level"`
}

type LearningOpportunitySpecification struct {
	Titles                      []Text                             `xml:"title,omitempty"`
	Type                        string                             `xml:"type,omitempty"`
	Description                 Text                               `xml:"description,omitempty"`
	LearningOpportunityInstance LearningOpportunityInstance        `xml:"specifies>learningOpportunityInstance,omitempty"`
	Parts                       []LearningOpportunitySpecification `xml:"hasPart>learningOpportunitySpecification,omitempty"`
}

type Report struct {
	Issuer                           Issuer                             `xml:"issuer"`
	LearningOpportunitySpecification []LearningOpportunitySpecification `xml:"learningOpportunitySpecification"`
}
type EducationCredential interface {
	ToJson() string
}

type Abitur struct {
	XMLName       xml.Name `xml:"elmo"`
	GeneratedDate string   `xml:"generatedDate"`
	Learner       Learner  `xml:"learner"`
	Reports       []Report `xml:"report"`
}

func (a *Abitur) ToJson() string {
	data, err := json.MarshalIndent(a, "", "  ")
	if err != nil {
		log.Fatalf("error while encoding to json")
		return ""
	}
	return string(data)
}

func CreateCredential(docType string) EducationCredential {
	switch docType {
	case "Abitur":
		return &Abitur{
			GeneratedDate: "none",
		}
	default:
		return nil
	}
}
