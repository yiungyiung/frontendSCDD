import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseService } from '../../services/ResponseService/Response.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { QuestionnaireAssignmentResponseDto, QuestionResponseDto } from '../../model/QuestionOptionResponseDto';
import { Location } from '@angular/common';
import { Domain } from '../../model/entity';

@Component({
  selector: 'app-ResponsePage',
  templateUrl: './ResponsePage.component.html',
  styleUrls: ['./ResponsePage.component.css'],
})
export class ResponsePageComponent implements OnInit {
  assignmentID: number | undefined;
  responses: QuestionnaireAssignmentResponseDto | undefined;
  domains: Set<number> = new Set(); // Store unique domain IDs
  domainNames: Map<number, string> = new Map(); // Store domain names by ID
  selectedDomain: number | undefined;
  filteredQuestions: QuestionResponseDto[] = [];

  constructor(
    private router: Router,
    private responseService: ResponseService,
    private entityService: EntityService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.assignmentID = state.assignmentID;

    this.loadResponses();
  }

  loadResponses(): void {
    this.responseService
      .getResponsesForAssignment(this.assignmentID!)
      .subscribe(
        (responses) => {
          this.responses = responses;
          console.log('Responses received:', responses);
          this.extractDomains();
        },
        (error) => {
          console.error('Error loading responses:', error);
        }
      );
  }

  extractDomains(): void {
    if (this.responses) {
      // Extract unique domain IDs
      this.responses.questions.forEach(question => {
        this.domains.add(question.domainID);
      });

      // Fetch domain names for all domain IDs
      this.fetchDomainNames();
    }
  }

  fetchDomainNames(): void {
    // Assuming you have a way to get the token, replace 'yourToken' with the actual token
    const token = 'yourToken'; 

    this.domains.forEach(domainID => {
      this.entityService.GetDomainById(domainID, token).subscribe(
        (domain: Domain) => {
          this.domainNames.set(domain.domainID, domain.domainName);
        },
        (error) => {
          console.error(`Error fetching domain ${domainID}:`, error);
        }
      );
    });
  }

  getQuestionsByDomain(domainID: number): QuestionResponseDto[] {
    return this.responses?.questions.filter(question => question.domainID === domainID) || [];
  }

  goBack(): void {
    this.location.back();
  }
}
